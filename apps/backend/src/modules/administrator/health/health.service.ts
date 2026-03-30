import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';


@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

    async checkDatabase() {
    try {
        await this.prisma.$queryRaw`SELECT 1`;
        return {
        status: 'up',
        database: 'connected',
        };
    } catch (error) {
        return {
        status: 'down',
        database: 'disconnected',
        error: error instanceof Error ? error.message : String(error),
        };
    }
    }

  async check() {
    const db = await this.checkDatabase();

    return {
      status: db.status === 'up' ? 'ok' : 'error',
      timestamp: new Date().toISOString(),
      services: {
        database: db,
      },
    };
  }
}