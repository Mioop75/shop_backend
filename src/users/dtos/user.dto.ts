import { Expose, Type } from "class-transformer";
import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";
import { ProductDto } from "src/products/dtos/product.dto";
import { RoleDto } from "src/roles/dtos/role.dto";

export class UserDto {
  @Expose()
  id: number;
  @Expose()
  @IsString()
  @IsOptional()
  avatar?: string;
  @Expose()
  @IsString()
  @IsEmail()
  email: string;
  @Expose()
  @IsString()
  name: string;
  @Expose()
  @IsString()
  description?: string;
  @Expose()
  @IsNumber()
  ratings: number;
  @Expose()
  @Type(() => RoleDto)
  role: RoleDto;
  @Expose()
  @Type(() => ProductDto)
  products: ProductDto[];
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
