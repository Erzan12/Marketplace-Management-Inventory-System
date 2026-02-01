import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(
        private prisma: PrismaService,
    ) {}

    async getUsers() {
        const currentUser = await this.prisma.user.findFirst({
            where: { role: 'admin' },
        })

        if(currentUser?.role !== 'admin' || currentUser?.role.length === 0) {
            throw new BadRequestException('Only administrators are allowed to create user account')
        }

        return this.prisma.user.findMany({
            include: { userProfile: true }
        });
    }
}
