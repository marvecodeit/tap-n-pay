import { Injectable } from '@nestjs/common';
import { db } from '../db/index.js';
import { student, studentWallet } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import type { NewStudent } from '../db/schema.js';
import { randomUUID } from 'node:crypto';

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
        return db.query.student.findFirst({
            where: eq(student.matric_id, matricId),
        })
    }

    async findById(id:string) {
        return db.query.student.findFirst({
            where:eq(student.id, id),
        })
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
