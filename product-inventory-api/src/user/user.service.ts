import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RESPONSE_MESSAGES } from '../common/constants/response-messages.constant';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) {}

    async register(email: string, password: string, role: string ='user') {
        const allowedRoles = ['user', 'admin']; //whitelist roles
        const userRole = role ?? 'user'; // fallback to user if undefined

        // if (!allowedRoles.includes(role)) {
        //     throw 
        // }
    }
}
