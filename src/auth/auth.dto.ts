import { PickType } from "@nestjs/mapped-types";
import { IsNumber, IsOptional } from "class-validator";
import { InputUserDto } from "src/users/dtos/input-user.dto";

export class AuthDto extends PickType(InputUserDto, [
  "email",
  "name",
  "password",
]) {
  @IsNumber()
  @IsOptional()
  roleId?: number;
}
