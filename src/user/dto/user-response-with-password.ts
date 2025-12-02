import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserDto } from './user.dto';

export class UserResponseWithPasswordDto extends OmitType(UserDto, ['password'] as const) {
  @Expose()
  @ApiProperty()
  password: string;
}
