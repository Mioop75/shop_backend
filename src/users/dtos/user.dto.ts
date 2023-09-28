import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";
import { ProductDto } from "../../products/dtos/product.dto";
import { RoleDto } from "../../roles/dtos/role.dto";

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
  @ApiProperty()
  email: string;
  @Expose()
  @IsString()
  @ApiProperty()
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
