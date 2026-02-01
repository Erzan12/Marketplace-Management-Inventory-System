import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private user: UserService) {}

    @Post('register')
    register(@Body() body: CreateUserDto) {
        return this.user.register(body.email, body.password, body.role);
    }
}
