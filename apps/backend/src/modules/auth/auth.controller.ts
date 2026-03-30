import { Body, Controller, ForbiddenException, Get, Param, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LogInDto } from './dto/log-in.dto';
import { Public } from '../../common/decorators/public.decorator';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiLoginResponse, ApiPostResponse } from '../../shared/helpers/swagger-api-response.helper';
import { Request, Response } from 'express';
import { SessionUser } from '../../shared/types/session-user.decorator';
import { RequestUser } from '../../shared/types/request-user.interface';
import { AuthenticatedRequest } from '../../shared/types/interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';

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

        res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 3600000,
        path: '/',
        });

        res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
        });

        return result;
    }

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

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
        }

        // Clear cookie here
        // res.clearCookie('accessToken', {
        // httpOnly: true,
        // secure: false,
        // sameSite: 'lax',
        // path: '/',
        // });
        res.clearCookie('accessToken', cookieOptions);

        // //clear refresh token
        // res.clearCookie('refreshToken', {
        // httpOnly: true,
        // secure: false,
        // sameSite: 'lax',
        // path: '/',
        // });
        res.clearCookie('refreshToken', cookieOptions);

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

    @Get('verify')
    @ApiOperation({ summary: 'Verify user' })
    @ApiLoginResponse('User has been verified')
    verify(
        @SessionUser() requsetUser: RequestUser
    ) {
        return this.authService.getUser(requsetUser);
    }

    @Public()
    @Post('refreshToken')
    async refreshToken(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {

        const refreshToken = req.cookies['refreshToken'];
        
        if (!refreshToken) {
            throw new ForbiddenException('No refresh token found. Please login again.');
        }

        const result = await this.authService.refreshToken(refreshToken);

        res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: '/',
        });

        return result;
    }
}
