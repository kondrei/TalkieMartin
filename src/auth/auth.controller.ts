import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VerifyUserDto } from './dto/verify-user.dto';
import { AuthService } from './auth.service';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { Public } from '../decorators/public.decorator';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../user/dto/user-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() body: VerifyUserDto): Promise<{ access_token: string }> {
    return this.authService.signIn(body);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  getProfile(@Request() req: any) {
    return plainToInstance(UserResponseDto, req.user);
  }
}
