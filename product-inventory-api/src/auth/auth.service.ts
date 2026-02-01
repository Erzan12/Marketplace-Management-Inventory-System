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
        // const allowedRoles = ['user', 'admin']; //whitelist roles
        // const userRole = role ?? 'user'; // fallback to user if undefined

        const { email, password } = dto;

        // if (!allowedRoles.includes(role)) {
        //     throw 
        // }

        const currentUser = await this.prisma.user.findFirst({
            where: { role: 'admin' },
        })

        if(currentUser?.role !== 'admin' || currentUser?.role.length === 0) {
            throw new BadRequestException('Only administrators are allowed to create user account')
        }

        const role = currentUser.role === Role.admin ? dto.role ?? Role.user: Role.user;

        const user = await this.prisma.user.create({
            data: {
                email,
                password,
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
            message: 'User has been created successfully',
            data: {
                user
            },
            created_by: {
                'user_id': currentUser.id,
                'role': currentUser.role
            }
        }
    }

    async login(dto: LogInDto) {
        const { email, password } = dto;

        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException({ message: RESPONSE_MESSAGES.USER.NOT_FOUND });
        }

        const jwt = this.jwt.sign({ sub: user.id, email: user.email});
        return { 
            access_token: jwt
        };
    }

    async validateUser(userId: number) {
        return this.prisma.user.findUnique({ where: { id: userId} });
    }
}
