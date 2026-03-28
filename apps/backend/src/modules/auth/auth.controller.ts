import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/log-in.dto';
import { Authenticated, Public } from '../../common/decorators/public.decorator';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiPostResponse } from '../../shared/helpers/swagger-api-response.helper';

// @Authenticated()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('login')
    login(@Body() dto: LogInDto) {
        return this.authService.login(dto);
    }

   
    @Post()
    @ApiBody({
        type: CreateUserDto,
        description: 'Payload to create a User Account'
    })
    @ApiOperation({
        summary: 'Create a User account',
    })
    @ApiPostResponse('User Account created successfully')
    createUser(
        @Body() dto: CreateUserDto,
    ) {
        return this.authService.register(dto)
    }
}
