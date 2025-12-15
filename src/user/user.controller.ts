import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserParamDto } from './dto/user-param.dot';
import { Public } from '../decorators/public.decorator';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new user.' })
  async createUser(@Body() body: UserDto): Promise<UserResponseDto> {
    const res = await this.userService.createUser(body);
    return res;
  }

  @Get('/:username')
  @ApiOperation({ summary: 'Get user by user name.' })
  async getByUserName(@Param() param: UserParamDto): Promise<UserResponseDto> {
    const res = await this.userService.getUserBy({ username: param.username });
    return res;
  }
}
