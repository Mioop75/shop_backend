import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { InjectUserInterceptor } from "src/shared/interceptors/InjectUser.interceptor";
import { CurrentUser } from "src/users/user.decorator";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "../roles/roles.decorator";
import { Role } from "../roles/roles.enum";
import { RolesGuard } from "../roles/roles.guard";
import { UploadFileInterceptor } from "../shared/interceptors/upload-file.interceptor";
import { ImageDto } from "./dtos/image.dto";
import { InputProductDto } from "./dtos/input-product.dto";
import { ProductDto } from "./dtos/product.dto";
import { ProductsService } from "./products.service";

@ApiTags("products")
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
  @Roles(Role.Seller)
  async createProduct(
    @CurrentUser("id") userId: number,
    @Body() dto: InputProductDto,
  ) {
    const product = await this.productsService.createProduct(dto, userId);
    return plainToInstance(ProductDto, product);
  }

  @Put(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Seller)
  async updateProduct(
    @CurrentUser("id") userId: number,
    @Body() dto: InputProductDto,
    @Param("id", ParseIntPipe) productId: number,
  ) {
    const product = await this.productsService.updateProduct(
      dto,
      userId,
      productId,
    );
    return plainToInstance(ProductDto, product);
  }

  @Delete(":id")
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(InjectUserInterceptor)
  @Roles(Role.Seller, Role.Admin)
  async deleteProduct(
    @CurrentUser("id") userId: number,
    @Param("id") productId: number,
  ) {
    return this.productsService.deleteProduct(productId, userId);
  }

  @Post("send-image")
  @UseInterceptors(
    UploadFileInterceptor("img", {
      dest: "uploads/products/images/[YYYY]/[MM]",
    }),
  )
  sendImage(@UploadedFile() img: Express.Multer.File) {
    const image = this.productsService.sendImage(img);
    console.log(image);

    return plainToInstance(ImageDto, image);
  }
}
