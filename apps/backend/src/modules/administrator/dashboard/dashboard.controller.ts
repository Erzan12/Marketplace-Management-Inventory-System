import { Controller, Get } from '@nestjs/common';
import { Roles } from '../../../common/decorators/public.decorator';
import { DashboardService } from './dashboard.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Administrator')
@Controller('dashboard')
export class DashboardController {
    constructor(private dashboardService: DashboardService) {}

    @Roles('admin')
    @Get()
    findAll() {
        return this.dashboardService.getUsers();
    }
}
