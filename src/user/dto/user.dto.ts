import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UserDto {
  @ApiPropertyOptional()
  @IsString()
  @MaxLength(30)
  @Expose()
  @IsOptional()
  id?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  @Expose()
  username: string;

  @ApiProperty()
  @IsEmail()
  @MaxLength(50)
  @Expose()
  email: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  @Expose()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  @Expose()
  lastName?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(30)
  @MinLength(8)
  password: string;

}
