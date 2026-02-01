import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { Roles } from '../common/decorators/public.decorator';
// import { Role } from '../auth/role.enum';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guard/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('api/analytics')
export class AnalyticsController {
    constructor( private analyticsService: AnalyticsService) {}
    
    @Get('admin-inventory')
    @Roles('admin')
    getInventoryStats() {
        return this.analyticsService.getInventoryAnalytics();
    }

    @Get('top-products')
    async getTopSelling() {
       const topProducts = await this.analyticsService.getTopSellingProducts();
        return {
            message: 'Top Products of All Time',
            data: topProducts,
        };
    }

    // Manual testing for snapshots can be testing in postman
    // @Get('snapshot/test')
    // async testSnapshotManually() {
    //     await this.analyticsService.saveMonthlyInventorySnapshot();
    //     return { message: '✅ Snapshot manually triggered.' };
    // }
}
