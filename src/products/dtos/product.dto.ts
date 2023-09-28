import { ApiProperty } from "@nestjs/swagger";
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
  @ApiProperty()
  name: string;
  @Expose()
  @IsString()
  @ApiProperty()
  description: string;
  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  available?: number;
  @Expose()
  @IsNumber()
  @IsOptional()
  @ApiProperty()
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
