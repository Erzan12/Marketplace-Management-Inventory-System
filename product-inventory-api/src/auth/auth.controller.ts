import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private auth: AuthService) {}

    @Post('login')
    login(@Body() body: { email: string; password: string}) {
        return this.auth.login(body.email, body.password);
    }
}
