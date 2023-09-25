import { Expose } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class ProductDto {
  @Expose()
  id: number;
  @Expose()
  @IsOptional()
  image?: string;
  @Expose()
  @IsString()
  name: string;
  @Expose()
  @IsString()
  description: string;
  @Expose()
  @IsNumber()
  @IsOptional()
  available?: number;
  @Expose()
  @IsNumber()
  @IsOptional()
  price?: number;
  @Expose()
  @IsNumber()
  @IsOptional()
  ratings?: number;
  @Expose()
  @IsArray()
  @IsOptional()
  photos?: string[];
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
