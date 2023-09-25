import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { AuthGuard } from "src/auth/auth.guard";
import { Cookies } from "src/auth/cookie.decorator";
import { Roles } from "src/roles/roles.decorator";
import { Role } from "src/roles/roles.enum";
import { RolesGuard } from "src/roles/roles.guard";
import { InputProductDto } from "./dtos/input-product.dto";
import { ProductDto } from "./dtos/product.dto";
import { ProductsService } from "./products.service";

@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAll() {
    const products = await this.productsService.getAll();

    return plainToInstance(ProductDto, products);
  }

  @Get(":id")
  async getOne(@Param("id") productId: number) {
    const product = await this.productsService.getOne(productId);
    return plainToInstance(ProductDto, product);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller, Role.Admin)
  async createProduct(@Cookies() sid: string, @Body() dto: InputProductDto) {
    const product = await this.productsService.createProduct(dto, sid);
    return plainToInstance(ProductDto, product);
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller, Role.Admin)
  async deleteProduct(@Cookies() sid: string, @Param("id") productId: number) {
    return this.productsService.deleteProduct(productId, sid);
  }
}
