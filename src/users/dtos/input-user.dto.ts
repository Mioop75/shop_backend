import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { UserDto } from "./user.dto";

export class InputUserDto extends PickType(UserDto, [
  "email",
  "name",
  "description",
] as const) {
  @IsString()
  @ApiProperty()
  password: string;
}
