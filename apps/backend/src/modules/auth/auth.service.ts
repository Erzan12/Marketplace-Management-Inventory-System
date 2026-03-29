import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/log-in.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { RESPONSE_MESSAGES } from '../../common/constants/response-messages.constant';
import { RequestUser } from '../../shared/types/request-user.interface';

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
                userProfile: {
                    create: {},     //create an empty user profile object for user to update later if user account is created
                }
            }
        })

        // ADMIN CHECK VALIDATOR IN API
        // const requestUser = await this.prisma.user.findUnique({
        //     where: { id: currentUser.id },
        //     include: {
        //         userProfile: true,
        //     },
        // });

        // if (!requestUser || requestUser.role !== Role.ADMIN ) {
        //     throw new BadRequestException(`User does not exist.`);
        // }

        // const isAdmin = 
        //     requestUser.role === Role.ADMIN;

        // if (!isAdmin) {
        //     throw new ForbiddenException(
        //         'You are not allowed to perform this action',
        //     );
        // }

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
            id: userValidate.id,
            email: userValidate.email,
            role: userValidate.role
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
            payload,
        };
    }

    async logout(requestUser: RequestUser) {
        try {
            await this.prisma.user.update({
            where: { id: requestUser.id }, // make sure this matches your interface
            data: {
                token_version: { increment: 1 },
            },
            });

            return {
            message: 'User logged out successfully',
            };
        } catch (error) {
            console.error(`User can't logout: ${error}`);
            // Throw proper HTTP exception so Swagger sees a response
            throw new BadRequestException('Unable to logout user');
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

    async getUser(requestUser: RequestUser) {
        if (!requestUser.id) {
            throw new UnauthorizedException('Invalid or missing token');
        };

        const user = await this.prisma.user.findUnique({
            where: { id: requestUser.id }, //enforce ownership to current user
            include: {
                orders: true,
                stores: true,
                cartItem: true,
                userProfile: true,
                storeMembers: true,
                reviews: true,
            }
        })

        if (!user || user.is_active !== true) {
            throw new UnauthorizedException('User not found or invalid token');
        };

        return {
            status: 'success',
            message: 'User validated successfully',
            data: {
                user
            }
        }
    }
}
