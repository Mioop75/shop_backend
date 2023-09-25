import { PickType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";
import { UserDto } from "./user.dto";

export class InputUserDto extends PickType(UserDto, [
  "email",
  "name",
  "description",
]) {
  @IsString()
  password: string;
}
