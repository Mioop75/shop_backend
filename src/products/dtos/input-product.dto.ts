import { PickType } from "@nestjs/swagger";
import { ProductDto } from "./product.dto";

export class InputProductDto extends PickType(ProductDto, [
  "name",
  "available",
  "description",
  "price",
  "photos",
  "image",
] as const) {
  categories: string[];
}
