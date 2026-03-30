import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserProfileDto } from './dto/user.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import { RequestUser } from '../../shared/types/request-user.interface';
import { SessionUser } from '../../shared/types/session-user.decorator';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('me')
    getUserProfile(@SessionUser() requestUser: RequestUser) {
        return this.userService.getUserProfile(requestUser);
    }

    @Put('me')
    @ApiBody({
        type: CreateUserProfileDto,
    })
    @ApiOperation({
        summary: 'Create or update user profile',
    })
    updateUserProfile(
        @Body() dto: CreateUserProfileDto,
        @SessionUser() requestUser: RequestUser,
    ) {
        return this.userService.upsertUserProfile(requestUser, dto);
    }
}
