import {
    Injectable, ConflictException, UnauthorizedException,
    BadRequestException, NotFoundException
} from "@nestjs/common";
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto'
import { UsersService } from "../users/users.service.js";
import type  { RegisterDto } from "./dto/register.dto.js";
import  type { loginDto } from "./dto/login.dto.js";
import type {Response} from 'express'
import { student, studentWallet, studentWalletTransaction, type Student } from '../db/schema.js'
import { EmailService } from "./email.service.js";
import { CloudinaryService, type ProfileImageUpload } from "./cloudinary.service.js";
import { db } from "../db/index.js";
import { desc, eq, or, sql } from 'drizzle-orm';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UsersService,
        private readonly jwtService:JwtService,
        private readonly configService:ConfigService,
        private readonly emailService:EmailService,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    async register(dto:RegisterDto, profileImage: ProfileImageUpload) {
        const email = dto.email.trim().toLowerCase();
        const matricId = dto.matric_id.trim().toUpperCase();
        const existingUser = await this.userService.findByEmail(email)

        if (existingUser)  {
            throw new ConflictException('An Account with this email already exist ')

        }
        if (await this.userService.findByMatricId(matricId)) {
            throw new ConflictException('An account with this student ID already exists');
        }

        const profileImageAsset =
            await this.cloudinaryService.uploadProfileImage(profileImage);
        const passwordHash = await bcrypt.hash(dto.password, 8)

       const verificationToken = crypto.randomBytes(32).toString('hex')
       const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) ///Expires at 24hrs
        const student = await this.userService.create({
            fullname:dto.fullname,
            profileImagePublicId: profileImageAsset.publicId,
            profileImageFormat: profileImageAsset.format,
            passwordHash,
            matric_id:matricId,
            level:dto.level,
            department:dto.department,
            phonenumber:dto.phoneNumber,
            faculty:dto.faculty,
            email,
            verificationToken,
            verificationTokenExpiresAt
        })

        await this.emailService.sendVerificationEmail(student.email, verificationToken)

        return {
            message:"Registration Succsssful. Please check your email to verify your account"
        }
    }

    getProfileImageUrl(userStudent: Student): string | null {
        if (!userStudent.profileImagePublicId || !userStudent.profileImageFormat) {
            return null;
        }
        return this.cloudinaryService.createAuthenticatedDeliveryUrl(
            userStudent.profileImagePublicId,
            userStudent.profileImageFormat,
        );
    }

    isProfileComplete(userStudent: Student): boolean {
        return this.userService.isProfileComplete(userStudent);
    }

    async uploadProfileImage(userId: string, profileImage: ProfileImageUpload) {
        const userStudent = await this.userService.findById(userId);
        if (!userStudent) {
            throw new NotFoundException('Student account not found.');
        }
        if (userStudent.profileImagePublicId && userStudent.profileImageFormat) {
            throw new ConflictException('A profile image is already set.');
        }

        const asset = await this.cloudinaryService.uploadProfileImage(profileImage);
        const updatedStudent = await this.userService.update(userId, {
            profileImagePublicId: asset.publicId,
            profileImageFormat: asset.format,
        });
        if (!updatedStudent) {
            throw new NotFoundException('Student account not found.');
        }

        return {
            profile_image_url: this.getProfileImageUrl(updatedStudent),
            is_profile_complete: this.isProfileComplete(updatedStudent),
        };
    }

    async verifyEmail(token:string, res:Response) {
        const student = await this.userService.findByVerificationToken(token)

        if(!student || !student.verificationToken) {
            throw new BadRequestException("Invalid verification token")
        }

        if(student.verificationTokenExpiresAt && student.verificationTokenExpiresAt < new Date()) {
            throw new BadRequestException(
                "Verification token has expired. Please request a new one"
            )
        } 
      await this.userService.update(student.id, {
        isVerified:true,
        verificationToken:null,
        verificationTokenExpiresAt:null
      })

       const tokens = await this.generateToken(student, res)

       return {
        message:"Email verified successfully. you are logged in ",
        accessToken:tokens.accessToken,
        student:{
            id:student.id,
            email:student.email,
            fullname:student.fullname,
            role:student.role
        }
       }
    }


    async login(dto:loginDto, res:Response) {
        const identifier = dto.identifier.trim();
        const [userStudent] = await db
            .select()
            .from(student)
            .where(or(
                eq(student.email, identifier.toLowerCase()),
                sql`upper(${student.matric_id}) = ${identifier.toUpperCase()}`,
            ))
            .limit(1);

        if (!userStudent) { throw new  UnauthorizedException("Invalid email and password") }

        const passwordMatches = await bcrypt.compare(dto.password, userStudent.passwordHash)

        if (!passwordMatches) {
            throw new UnauthorizedException("Invalid email and password ")
        }
        if (!userStudent.isVerified) {
            throw new UnauthorizedException("Please verify your email before logging in ")
        }

        return this.generateToken(userStudent, res);
    }

    async refresh(refreshToken: string, res: Response) {
        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token is required');
        }

       

        try {
            const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
            const payload = await this.jwtService.verifyAsync<{ sub: string }>(refreshToken, {
                secret: refreshSecret,
            });

            const refreshTokenHash = crypto
                .createHash('sha256')
                .update(refreshToken)
                .digest('hex');

            const [userStudent] = await db
                .select()
                .from(student)
                .where(eq(student.id, payload.sub))
                .limit(1);

            if (!userStudent) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            const tokenMatch = userStudent.refreshTokenHash === refreshTokenHash;
            if (!tokenMatch) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            return this.generateToken(userStudent, res);
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(userId:string, res:Response)   {
        await this.userService.update(userId, {refreshTokenHash:null})

        res.clearCookie('refresh_token', { path: '/api/auth' });
        return {message:"Logged Out"}
    }

    async getStudentWallet(studentId: string) {
        const wallet = await db.query.studentWallet.findFirst({
            where: eq(studentWallet.userId, studentId),
        });

        if (!wallet) {
            throw new NotFoundException('Student wallet not found');
        }

        const transactions = await db
            .select()
            .from(studentWalletTransaction)
            .where(eq(studentWalletTransaction.walletId, wallet.id))
            .orderBy(desc(studentWalletTransaction.createdAt))
            .limit(50);

        return {
            id: wallet.id,
            balanceKobo: this.toKobo(wallet.walletBalanace),
            transactions: transactions.map((transaction) => ({
                id: transaction.id,
                type: transaction.type,
                amountKobo: this.toKobo(transaction.balance),
                balanceAfterKobo: this.toKobo(transaction.balanceAfter),
                reference: transaction.reference,
                description: transaction.description,
                createdAt: transaction.createdAt.toISOString(),
            })),
        };
    }

    private async generateToken(userStudent: Student, res: Response) {
        const payload: { sub: string; email: string } = {
            sub: userStudent.id,
            email: userStudent.email,
        };
        const accessSecret = this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
        const refreshSecret = this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
        const accessExpiresIn = this.configService.getOrThrow<string>('JWT_ACCESS_EXPIRE_IN');
        const refreshExpiresIn = this.configService.getOrThrow<string>('JWT_REFRESH_EXPIRES_IN');

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: accessSecret,
                expiresIn: accessExpiresIn as JwtSignOptions['expiresIn'],
            }),
            this.jwtService.signAsync(payload, {
                secret: refreshSecret,
                expiresIn: refreshExpiresIn as JwtSignOptions['expiresIn'],
            }),
        ]);

        await this.saveRefreshToken(userStudent.id, refreshToken);
        this.setRefreshCookie(res, refreshToken);

        return { accessToken };
    }

    private toKobo(naira: string): number {
        const [wholeUnits, fractionalUnits = ''] = naira.split('.');
        const kobo = fractionalUnits.padEnd(2, '0').slice(0, 2);
        return Number(wholeUnits) * 100 + Number(kobo);
    }

    private async saveRefreshToken(studentId: string, refreshToken: string) {
        const refreshTokenHash = crypto
            .createHash('sha256')
            .update(refreshToken)
            .digest('hex');

        await db
            .update(student)
            .set({ refreshTokenHash })
            .where(eq(student.id, studentId));
    }

    private setRefreshCookie(res: Response, refreshToken: string) {
        const decodedToken = this.jwtService.decode<{ exp?: number }>(refreshToken);
        if (!decodedToken || typeof decodedToken.exp !== 'number') {
            throw new Error('Refresh token is missing its expiration.');
        }

        const maxAge = decodedToken.exp * 1000 - Date.now();
        if (maxAge <= 0) {
            throw new Error('Refresh token has already expired.');
        }

        res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'strict',
            path: '/api/auth',
            maxAge,
        });
    }

} 