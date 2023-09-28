import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { InjectUserInterceptor } from "src/shared/interceptors/InjectUser.interceptor";
import { CurrentUser } from "src/users/user.decorator";
import { AuthGuard } from "../auth/auth.guard";
import { Roles } from "../roles/roles.decorator";
import { Role } from "../roles/roles.enum";
import { RolesGuard } from "../roles/roles.guard";
import { ApiMultiFile } from "../shared/decorators/api-multer.decorator";
import {
  UploadFileInterceptor,
  UploadFilesInterceptor,
} from "../shared/interceptors/upload-file.interceptor";
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
  @ApiBody({
    type: "multipart/form-data",
    required: true,
    schema: {
      type: "object",
      properties: {
        img: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiMultiFile("photos")
  @UseInterceptors(
    UploadFileInterceptor("img", { dest: "uploads/products/img/[YYYY]/[MM]" }),
    UploadFilesInterceptor("photos", 8, {
      dest: "uploads/products/photos/[YYYY]/MM",
    }),
    InjectUserInterceptor,
  )
  @Roles(Role.Seller)
  async createProduct(
    @CurrentUser("id") userId: number,
    @Body() dto: InputProductDto,
    @UploadedFile() img: Express.Multer.File,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    const product = await this.productsService.createProduct(
      dto,
      userId,
      photos,
      img,
    );
    return plainToInstance(ProductDto, product);
  }

  @Put()
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBody({
    type: "multipart/form-data",
    required: true,
    schema: {
      type: "object",
      properties: {
        img: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @ApiMultiFile("photos")
  @UseInterceptors(
    UploadFileInterceptor("img", { dest: "uploads/products/img/[YYYY]/[MM]" }),
    UploadFilesInterceptor("photos", 8, {
      dest: "uploads/products/photos/[YYYY]/MM",
    }),
    InjectUserInterceptor,
  )
  @Roles(Role.Seller)
  async updateProduct(
    @CurrentUser("id") userId: number,
    @Body() dto: InputProductDto,
    @UploadedFile() img: Express.Multer.File,
    @UploadedFiles() photos: Express.Multer.File[],
  ) {
    const product = await this.productsService.updateProduct(
      dto,
      userId,
      photos,
      img,
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
}
