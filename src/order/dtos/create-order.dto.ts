import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";

export class CreateOrderDto {
  @IsArray()
  @ApiProperty()
  productIds: number[] = [];
}
