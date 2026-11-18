import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import { EmailService } from "./email.service.js";
import { UsersModule } from "../users/users.module.js";
import { AccessTokenGuard } from "./access-token.guard.js";
import { CloudinaryService } from "./cloudinary.service.js";

@Module({
    imports:[
        UsersModule, JwtModule.register({global:true})
    ],
    controllers:[AuthController],
    providers:[AuthService, EmailService, AccessTokenGuard, CloudinaryService]
})

export class AuthModule {}
