import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/log-in.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { RESPONSE_MESSAGES } from '../../common/constants/response-messages.constant';
import { RequestUser } from '../../shared/types/request-user.interface';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {}

    async register(dto: CreateUserDto) {
        const { email, password } = dto;

        // Check if user with email already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new BadRequestException('User with this email already exists');
        }

        // Check if this is the first user - make them admin
        const userCount = await this.prisma.user.count();
        const isFirstUser = userCount === 0;
        
        // If first user, make them admin; otherwise use provided role or default to user
        const role = isFirstUser ? Role.ADMIN :  Role.CUSTOMER;

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
            }
        })

        return {
            status: 'success',
            message: isFirstUser 
                ? 'First user created as administrator'
                : 'User(customer account) has been created successfully',
            data: {
                user
            },
            is_first_user: isFirstUser,
            user_role: role
        }
    }

    async login(dto: LogInDto) {
        const { email, password } = dto;

        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException({ message: RESPONSE_MESSAGES.USER.NOT_FOUND });
        }

        const userValidate = await this.validateUser(email, password);

        if (userValidate.is_active !== true) {
            throw new BadRequestException ('Your account was deactivated')
        }

        const payload = {
            userID: user.id,
            email: user.email,
            role: user.role
        }

        const token = this.jwtService.sign(payload, { 
            secret: process.env.JWT_SECRET,
            expiresIn: '8h'
        });

        await this.prisma.user.update({
            where: { id: user.id},
            data: {
                last_login: new Date()
            }
        });

        return {
            status: 1,
            message: 'Login successful',
            token,
            // payload,
        };
    }

    async logout(
        requestUser: RequestUser
    ) {
        await this.prisma.user.update({
            where: { id: requestUser.id },
            data: {
                token_version: {increment: 1},
            },
        });

        return {
            message: 'User log out successfully'
        }
    }

    async validateUser(email: string, password: string) {
        const user = await this.prisma.user.findUnique({ 
            where: { email },
            include: {
                orders: true,
                stores: true,
                cartItem: true,
                userProfile: true,
            }
        });

        if (!user) {
            throw new NotFoundException ('User not found')
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        console.log('Password valid?', isPasswordValid);

        if (!isPasswordValid) {
            throw new UnauthorizedException ('Invalid password')
        }

        return user;
    }
}
