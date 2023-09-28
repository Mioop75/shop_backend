import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsNumber, IsOptional } from "class-validator";
import { InputUserDto } from "../users/dtos/input-user.dto";

export class AuthDto extends PickType(InputUserDto, [
  "email",
  "name",
  "password",
] as const) {
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  roleId?: number;
}
