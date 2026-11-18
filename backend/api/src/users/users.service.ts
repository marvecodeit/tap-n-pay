import {
    BadRequestException,
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { db } from '../db/index.js';
import {
    student,
    studentWallet,
    studentWalletTransaction,
} from '../db/schema.js';
import { eq, sql } from 'drizzle-orm';
import type { NewStudent, Student } from '../db/schema.js';
import { randomUUID } from 'node:crypto';

interface WalletDebitRow {
    id: string;
    wallet_id: string;
    type: string;
    amount: string;
    balance_after: string;
    reference: string;
    description: string | null;
    created_at: Date | string;
}

@Injectable()
export class UsersService {
    
   async findByVerificationToken(token: string) {
    return db.query.student.findFirst({
        where:eq(student.verificationToken, token)
    })
   }

    async findByEmail(email:string) {
        return db.query.student.findFirst({
            where:eq(student.email, email),
        })
    }

    async findByMatricId(matricId: string) {
            const normalizedMatricId = matricId.trim().toUpperCase();
            const exactMatch = await db.query.student.findFirst({
                where: sql`upper(btrim(${student.matric_id})) = ${normalizedMatricId}`,
            });
            if (exactMatch) {
                return exactMatch;
            }

            const slashlessMatricId = normalizedMatricId.replace(/\//g, '');
            const matches = await db.query.student.findMany({
                where: sql`upper(replace(btrim(${student.matric_id}), '/', '')) = ${slashlessMatricId}`,
                limit: 2,
            });
            if (matches.length > 1) {
                throw new ConflictException(
                    'This barcode matches multiple matric IDs. Contact campus administration.',
                );
            }
            return matches[0];
    }

    async findById(id:string) {
        return db.query.student.findFirst({
            where:eq(student.id, id),
        })
    }

    isProfileComplete(userStudent: Student): boolean {
        return [
            userStudent.fullname,
            userStudent.matric_id,
            userStudent.email,
            userStudent.phonenumber,
            userStudent.department,
            userStudent.faculty,
            userStudent.level,
        ].every((value) => value.trim().length > 0) &&
            Boolean(userStudent.profileImagePublicId && userStudent.profileImageFormat);
    }

    async findWalletByUserId(userId: string) {
        return db.query.studentWallet.findFirst({
            where: eq(studentWallet.userId, userId),
        });
    }

    async debitStudentWallet(
        userId: string,
        amountKobo: number,
        reference: string,
        terminalId: string,
        cashierId: string,
    ) {
        const amountNaira = `${Math.floor(amountKobo / 100)}.${String(amountKobo % 100).padStart(2, '0')}`;
        const description = `Terminal payment at ${terminalId} by ${cashierId}`;
        let transaction: WalletDebitRow | undefined;
        try {
            const result = await db.execute(sql<WalletDebitRow>`
            WITH reference_lock AS MATERIALIZED (
                SELECT pg_advisory_xact_lock(hashtext(${reference}))
            ),
            target_wallet AS (
                SELECT id
                FROM "studentWallet"
                WHERE user_id = ${userId}
            ),
            existing_transaction AS MATERIALIZED (
                SELECT
                    t.id,
                    t.wallet_id,
                    t.type,
                    t.wallet_balance AS amount,
                    t.balance_after,
                    t.reference,
                    t.description,
                    t.created_at
                FROM "studentWalletTransaction" AS t
                CROSS JOIN reference_lock
                WHERE t.reference = ${reference}
            ),
            debited_wallet AS (
                UPDATE "studentWallet" AS wallet
                SET
                    wallet_balance = wallet.wallet_balance - ${amountNaira}::numeric,
                    updated_at = NOW()
                WHERE wallet.id = (SELECT id FROM target_wallet)
                    AND wallet.wallet_balance >= ${amountNaira}::numeric
                    AND NOT EXISTS (SELECT 1 FROM existing_transaction)
                RETURNING wallet.id AS wallet_id, wallet.wallet_balance AS balance_after
            ),
            inserted_transaction AS (
                INSERT INTO "studentWalletTransaction" (
                    wallet_id,
                    type,
                    wallet_balance,
                    balance_after,
                    reference,
                    description
                )
                SELECT
                    debited_wallet.wallet_id,
                    'debit',
                    ${amountNaira}::numeric,
                    debited_wallet.balance_after,
                    ${reference},
                    ${description}
                FROM debited_wallet
                RETURNING
                    id,
                    wallet_id,
                    type,
                    wallet_balance AS amount,
                    balance_after,
                    reference,
                    description,
                    created_at
            )
            SELECT * FROM inserted_transaction
            UNION ALL
            SELECT *
            FROM existing_transaction
            WHERE wallet_id = (SELECT id FROM target_wallet)
            `);

            [transaction] = result.rows as unknown as WalletDebitRow[];
        } catch (error) {
            if (!this.isUniqueViolation(error)) {
                throw error;
            }

            const existing = await db.query.studentWalletTransaction.findFirst({
                where: eq(studentWalletTransaction.reference, reference),
            });
            if (!existing) {
                throw error;
            }
            const wallet = await this.findWalletByUserId(userId);
            if (!wallet) {
                throw new NotFoundException('Student wallet not found.');
            }
            if (existing.walletId !== wallet.id) {
                throw new ConflictException(
                    'This transaction reference has already been used.',
                );
            }
            transaction = {
                id: existing.id,
                wallet_id: existing.walletId,
                type: existing.type,
                amount: existing.balance,
                balance_after: existing.balanceAfter,
                reference: existing.reference,
                description: existing.description,
                created_at: existing.createdAt,
            };
        }

        if (!transaction) {
            const wallet = await this.findWalletByUserId(userId);
            if (!wallet) {
                throw new NotFoundException('Student wallet not found.');
            }
            if (this.toKobo(wallet.walletBalanace) < amountKobo) {
                throw new BadRequestException('Insufficient wallet balance.');
            }
            throw new ConflictException(
                'This transaction reference has already been used.',
            );
        }

        if (
            transaction.type !== 'debit' ||
            this.toKobo(transaction.amount) !== amountKobo
        ) {
            throw new ConflictException(
                'This transaction reference belongs to a different payment.',
            );
        }

        const wallet = await this.findWalletByUserId(userId);
        if (!wallet) {
            throw new NotFoundException('Student wallet not found.');
        }

        return {
            transaction: {
                id: transaction.id,
                type: 'debit' as const,
                amountKobo,
                balanceAfterKobo: this.toKobo(transaction.balance_after),
                reference: transaction.reference,
                description: transaction.description,
                createdAt: new Date(transaction.created_at).toISOString(),
            },
            balanceKobo: this.toKobo(wallet.walletBalanace),
        };
    }

    private toKobo(naira: string): number {
        const [wholeUnits, fractionalUnits = ''] = naira.split('.');
        return (
            Number(wholeUnits) * 100 +
            Number(fractionalUnits.padEnd(2, '0').slice(0, 2))
        );
    }

    private isUniqueViolation(error: unknown): boolean {
        return (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === '23505'
        );
    }

    async create(data:NewStudent) {
        const studentId = randomUUID();
        const [studentUsers] = await db.batch([
            db.insert(student).values({ ...data, id: studentId }).returning(),
            db.insert(studentWallet).values({ userId: studentId }).returning(),
        ]);
        const [studentUser] = studentUsers;
        return studentUser;
    }

    async update(id:string, data:Partial<typeof student.$inferInsert>) {
            const [userStudent] = await db.update(student)
                .set({...data, updatedAt:new Date()})
                .where(eq(student.id, id))
                .returning();
            return userStudent;
    }
    async findAll() {
        return db.query.student.findMany();
    }

    async delete(id:string) {
        return db.delete(student).where(eq(student.id, id))
    }
    
} 
