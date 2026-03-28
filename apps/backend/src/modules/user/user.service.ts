import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from './dto/user.dto';
import { Role } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RESPONSE_MESSAGES } from '../../common/constants/response-messages.constant';

@Injectable()
export class UserService {
    constructor( private prisma: PrismaService ) {}

    // async createUser(dto: CreateUserDto) {
    //     const existingUser = await this.prisma.user.findUnique({
    //         where: { email: dto.email }
    //     })

    //     if (existingUser) {
    //         throw new ConflictException ('User already exist!')
    //     }

    //     const hashedPassword = await bcrypt.hash(dto.password, 10)

    //     const user = await this.prisma.user.create({
    //         data: {
    //             email: dto.email,
    //             password: hashedPassword,
    //             userProfile: {
    //                 create: {},     //create an empty user profile object for user to update later if user account is created
    //             }
    //         },
    //     })

    //     return {
    //         status: 'success',
    //         messsage: 'User created successfully',
    //         user,
    //     }
    // }

    // async createUserProfile()
}
