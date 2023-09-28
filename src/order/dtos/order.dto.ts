import { Expose } from "class-transformer";
import { IsString } from "class-validator";
import { ProductDto } from "src/products/dtos/product.dto";
import { UserDto } from "../../users/dtos/user.dto";

export class OrderDto {
  @Expose()
  id: number;
  @Expose()
  @IsString()
  name: string;
  @Expose()
  products: ProductDto[];
  @Expose()
  user: UserDto;
}
