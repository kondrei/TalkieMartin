import { Injectable, UnauthorizedException } from '@nestjs/common';
import { VerifyUserDto } from 'src/user/dto/verify-user.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserResponseWithPasswordDto } from '../user/dto/user-response-with-password';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}
  async signIn(user: VerifyUserDto): Promise<{ access_token: string }> {
    const { password, id, email, firstName, lastName } =
      (await this.userService.getUserBy(
        { email: user.email },
        true,
      )) as UserResponseWithPasswordDto;

    const passwordMatch = await bcrypt.compare(user?.password, password);
    if (!passwordMatch)
      throw new UnauthorizedException(
        'User does not exist or invalid credentials',
      );

    const token = await this.jwtService.signAsync({
      sub: `${id}`,
      email: email,
      firstName: firstName,
      lastName: lastName,
    });
    return { access_token: token };
  }
}
