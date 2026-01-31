import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RESPONSE_MESSAGES } from '../common/constants/response-messages.constant';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) {}

    async register(email: string, password: string, role: string = 'user') {
        const allowedRoles = ['user', 'admin']; // whitelist roles
        const userRole = role ?? 'user'; // fallback to user if undefined

        if (!allowedRoles.includes(role)) {
            throw new BadRequestException('Invalid role');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: userRole, // default role
            },
        });
        return { 
            message: RESPONSE_MESSAGES.USER.CREATED, 
            userId: user.id
        };
    }

    async login(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException({ message: RESPONSE_MESSAGES.USER.NOT_FOUND });
        }

        const jwt = this.jwt.sign({ sub: user.id, email: user.email});
        return { 
            // message: RESPONSE_MESSAGES.AUTH.LOGIN_SUCCESS,
            access_token: jwt
        };
    }

    async validateUser(userId: number) {
        return this.prisma.user.findUnique({ where: { id: userId} });
    }
}
