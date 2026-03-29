import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/user.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestUser } from '../../shared/types/request-user.interface';

@Injectable()
export class UserService {
    constructor( private prisma: PrismaService ) {}

    async getUserProfile(requestUser: RequestUser) {
        const userProfile = await this.prisma.user.findUnique({
            where: { id: requestUser.id },
            include: {
                userProfile: true,
            }
        })

        if (!userProfile) {
            throw new NotFoundException('User not found')
        }

        return {
            status: 'success',
            message: 'User Information',
            userProfile
        }
    }

    async upsertUserProfile(requestUser: RequestUser, dto: CreateUserProfileDto) {
        const userProfile = await this.prisma.userProfile.upsert({
            where: { userId: requestUser.id },
            update: {
                ...dto,
                dateOfBirth: dto.dateOfBirth
                    ? new Date(dto.dateOfBirth)
                    : undefined,
            },
            create: {
                userId: requestUser.id,
                ...dto,
                dateOfBirth: dto.dateOfBirth
                    ? new Date(dto.dateOfBirth)
                    : undefined,
            },
        });

        return {
            status: 'success',
            message: 'Profile saved successfully',
            userProfile,
        };
    }
}
