import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Role } from '../../../shared/constants/enums.decorator';

@Injectable()
export class DashboardService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async getUsers() {
        const currentUser = await this.prisma.user.findFirst({
            where: { role: Role.ADMIN },
        })

        if(currentUser?.role !== Role.ADMIN || currentUser?.role.length === 0) {
            throw new BadRequestException('Only administrators are allowed to create user account')
        }

        return this.prisma.user.findMany({
            include: { userProfile: true }
        });
    }
}
