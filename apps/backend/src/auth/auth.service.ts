import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RESPONSE_MESSAGES } from '../common/constants/response-messages.constant';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/log-in.dto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) {}

    // async register(email: string, password: string, role: string = 'user') {
    //     const allowedRoles = ['user', 'admin'];
    //     const userRole = role ?? 'user';

    //     if (!allowedRoles.includes(userRole)) {
    //         throw new BadRequestException('Invalid role');
    //     }

    //     const existingUser = await this.prisma.user.findUnique({ where: { email } });
    //     if (existingUser) {
    //         throw new BadRequestException('User with this email already exists');
    //     }

    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     const user = await this.prisma.user.create({
    //         data: {
    //             email,
    //             password: hashedPassword,
    //             role: userRole as Role,
    //         },
    //     });
        
    //     return { 
    //         message: RESPONSE_MESSAGES.USER.CREATED, 
    //         userId: user.id
    //     };
    // }

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
        const role = isFirstUser ? Role.admin : (dto.role ?? Role.user);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role
            }
        })

        // let requestUser;
    
        // if (user.role === 'admin') {
        //     requestUser = user;
        // } else {
        //     requestUser = await this.prisma.user.findUnique({
        //         where: { id: user.id }
        //     })
        // }

        return {
            status: 'success',
            message: isFirstUser 
                ? 'First user created as administrator'
                : 'User has been created successfully',
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

        const jwt = this.jwt.sign({ sub: user.id, email: user.email, role: user.role});
        return { 
            access_token: jwt
        };
    }

    async validateUser(userId: number) {
        return this.prisma.user.findUnique({ where: { id: userId} });
    }
}
