import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Authenticated, Public } from '../common/decorators/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/log-in.dto';

@Authenticated()
@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @Public()
    @Post('login')
    login(@Body() dto: LogInDto) {
        return this.auth.login(dto);
    }

    @Public()
    @Post('register')
    register(@Body() dto: CreateUserDto) {
        return this.auth.register(dto);
    }
}
