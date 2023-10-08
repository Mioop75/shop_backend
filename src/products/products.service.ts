import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { unlink } from "fs/promises";
import { substractArrays } from "src/shared/utils/substract-arrays.util";
import { PrismaService } from "../prisma.service";
import { InputProductDto } from "./dtos/input-product.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.product.findMany({
      include: { author: true },
    });
  }

  async getOne(productId: number) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId },
      include: { author: true },
    });

    console.log(product);

    if (!product) {
      throw new NotFoundException("Product hasn't been found");
    }

    return product;
  }

  async createProduct(dto: InputProductDto, userId: number) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User hasn't been found");
    }

    const oldProduct = await this.prisma.product.findFirst({
      where: { name: dto.name },
    });

    if (oldProduct) {
      throw new BadRequestException("Product already exists");
    }

    const product = await this.prisma.product
      .create({
        data: {
          ...dto,
          user_id: user.id,
          image: dto?.image,
          photos: dto.photos?.map((photo) => photo),
          categories: {
            connect: dto.categories?.map((category) => ({
              name: category,
            })),
          },
        },
      })
      .catch(() => {
        throw new BadRequestException("Product with this name already exists");
      });

    return product;
  }

  async updateProduct(dto: InputProductDto, userId: number, productId: number) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException("User hasn't been found");
    }

    const oldProduct = await this.prisma.product.findFirst({
      where: { id: productId },
    });

    if (oldProduct?.image && oldProduct?.image !== dto?.image) {
      await unlink(oldProduct.image);
    }

    await Promise.allSettled(
      substractArrays(
        oldProduct.photos.map((photo) => photo),
        dto.photos.map((photo) => photo),
      ).map(async (photo) => await unlink(photo)),
    );

    if (oldProduct) {
      throw new BadRequestException("Product already exists");
    }

    if (oldProduct.user_id !== user.id) {
      throw new BadRequestException("This isn't your product");
    }

    const product = await this.prisma.product
      .update({
        where: { id: oldProduct.id },
        data: {
          ...dto,
          image: dto?.image,
          photos: dto.photos?.map((photo) => photo),
          categories: {
            connect: dto.categories?.map((category) => ({
              name: category,
            })),
          },
        },
      })
      .catch(() => {
        throw new BadRequestException("Product with this name already exists");
      });

    return product;
  }

  async deleteProduct(productId: number, userId: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      include: { role: true },
    });

    const product = await this.prisma.product.findFirst({
      where: { id: productId },
    });

    if (product?.image) {
      await unlink(product.image);
    }

    await Promise.allSettled(
      product.photos.map((photo) => {
        unlink(photo);
      }),
    );

    if (!product) {
      throw new NotFoundException("Product hasn't been found");
    }

    if (user.role.name !== "Admin") {
      throw new BadRequestException(
        "This isn't your product or you aren't admin",
      );
    }

    await this.prisma.product.delete({ where: { id: product.id } });

    return "Product has been deleted";
  }

  sendImage(img: Express.Multer.File) {
    return img;
  }
}
