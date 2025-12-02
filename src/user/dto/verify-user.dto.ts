import { PickType } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class VerifyUserDto extends PickType(
    UserDto,
    ['email', 'password'] as const,
) {}