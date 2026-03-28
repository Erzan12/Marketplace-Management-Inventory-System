import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/log-in.dto';
import { Authenticated, Public } from '../../common/decorators/public.decorator';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiPostResponse } from '../../shared/helpers/swagger-api-response.helper';
import { Request, Response } from 'express';
import { SessionUser } from '../../shared/types/session-user.decorator';
import { RequestUser } from '../../shared/types/request-user.interface';
import { JwtAuthGuard } from '../../common/guard/jwt-auth.guard';
import { AuthenticatedRequest } from '../../shared/types/interface';

@Authenticated()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Public()
    @Post('login')
    @ApiOperation({ summary: 'User authorized login' })
    async login(
        @Body() dto: LogInDto,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        // const ipAddress = req.ip || req.socket.remoteAddress;

        const result = await this.authService.login(dto);

        res.cookie('accessToken', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600000,
        path: '/',
        });

        return result;
    }

    // @UseGuards(JwtAuthGuard)
    @Post('logout')
    @ApiOperation({ summary: 'User will logout' })
    @ApiPostResponse('User logout successfully')
    logout(
        @SessionUser() requestUser: RequestUser,
        @Req() req: AuthenticatedRequest,
        @Res({ passthrough: true }) res: Response,
    ) {
        // const ipAddress = req.ip || req.socket.remoteAddress;
        // const userAgent = req.headers['user-agent'];

        // Clear cookie here
        res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        });

        return this.authService.logout(requestUser);
    }

    @Public()
    @Post('register')
    @ApiBody({
        type: CreateUserDto,
        description: 'Payload to create a User Account'
    })
    @ApiOperation({ summary: 'Create a User account' })
    @ApiPostResponse( 'User Account created successfully' )
    createUser(
        @Body() dto: CreateUserDto,
    ) {
        return this.authService.register(dto)
    }
}
