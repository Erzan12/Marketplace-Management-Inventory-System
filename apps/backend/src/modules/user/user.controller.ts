import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { ApiPostResponse } from '../../shared/helpers/swagger-api-response.helper';

@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    // @Post()
    // @ApiBody({
    //     type: CreateUserDto,
    //     description: 'Payload to create a User Account'
    // })
    // @ApiOperation({
    //     summary: 'Create a User account',
    // })
    // @ApiPostResponse('User Account created successfully')
    // createUser(
    //     @Body() dto: CreateUserDto,
    // ) {
    //     return this.userService.createUser(dto)
    // }
}
