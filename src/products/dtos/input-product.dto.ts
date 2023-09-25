import { PickType } from "@nestjs/mapped-types";
import { ProductDto } from "./product.dto";

export class InputProductDto extends PickType(ProductDto, [
  "name",
  "available",
  "description",
  "price",
]) {}
