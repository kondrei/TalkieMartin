import { ApiProperty } from "@nestjs/swagger";
import { IsString, max, MaxLength } from "class-validator";

export class UserParamDto {
  @ApiProperty()
  @IsString()
  @MaxLength(30)
  username: string;
}