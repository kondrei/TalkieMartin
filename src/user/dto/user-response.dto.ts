import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserDto } from './user.dto';

export class UserResponseDto extends OmitType(UserDto, ['password'] as const) {
}
