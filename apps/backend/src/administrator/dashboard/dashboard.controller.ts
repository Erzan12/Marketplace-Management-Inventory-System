import { Controller, Get } from '@nestjs/common';
import { Authenticated, Roles } from '../../common/decorators/public.decorator';
import { DashboardService } from './dashboard.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Administrator')
@Controller('dashboard')
export class DashboardController {
    constructor(private dashboardService: DashboardService) {}

    @Authenticated()
    @Roles('admin')
    @Get()
    findAll() {
        return this.dashboardService.getUsers();
    }
}
