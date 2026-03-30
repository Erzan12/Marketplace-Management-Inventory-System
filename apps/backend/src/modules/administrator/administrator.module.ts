import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { HealthService } from './health/health.service';
import { HealthController } from './health/health.controller';

@Module({
  providers: [DashboardService, PrismaService, HealthService],
  controllers: [DashboardController, HealthController]
})
export class AdministratorModule {}
