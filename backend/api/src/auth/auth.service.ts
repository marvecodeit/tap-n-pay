import {
    Injectable, ConflictException, UnauthorizedException,
    BadRequestException
} from "@nestjs/common";
import { JwtService, type JwtSignOptions } from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto'
import { UsersService } from "../users/users.service.js";
import type  { RegisterDto } from "./dto/register.dto.js";
import  type { loginDto } from "./dto/login.dto.js";
import type {Response} from 'express'
import {student, type Student} from '../db/schema.js'
import { EmailService } from "./email.service.js";
import { db } from "../db/index.js";
import { eq, or } from 'drizzle-orm';
@Injectable()
export class AuthService {
    constructor(
        private readonly userService:UsersService,
        private readonly jwtService:JwtService,
        private readonly configService:ConfigService,
        private readonly emailService:EmailService,
    ) {}

    async register(dto:RegisterDto) {
        const email = dto.email.trim().toLowerCase();
        const matricId = dto.matric_id.trim();
        const existingUser = await this.userService.findByEmail(email)

        if (existingUser)  {
            throw new ConflictException('An Account with this email already exist ')

        }
        if (await this.userService.findByMatricId(matricId)) {
            throw new ConflictException('An account with this student ID already exists');
        }

        const passwordHash = await bcrypt.hash(dto.password, 8)

       const verificationToken = crypto.randomBytes(32).toString('hex')
       const verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) ///Expires at 24hrs
        const student = await this.userService.create({
            fullname:dto.fullname,
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
                eq(student.matric_id, identifier),
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