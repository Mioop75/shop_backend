import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";
import { UserDto } from "src/users/dtos/user.dto";

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
  @Type(() => UserDto)
  author: UserDto;
  @Expose()
  @IsArray()
  @IsOptional()
  photos?: string[];
  @Expose()
  createdAt: Date;
  @Expose()
  updatedAt: Date;
}
