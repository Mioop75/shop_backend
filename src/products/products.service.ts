import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
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
    const user = await this.prisma.product.findFirst({
      where: { id: productId },
      include: { author: true },
    });

    if (!user) {
      throw new NotFoundException("Product hasn't been found");
    }

    return user;
  }

  async createProduct(dto: InputProductDto, sid: string) {
    const user = await this.prisma.user_Sessions.findFirst({ where: { sid } });

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
        data: { ...dto, user_id: user.user_id },
      })
      .catch(() => {
        throw new BadRequestException("Product with this name already exists");
      });

    return product;
  }

  async deleteProduct(productId: number, sid: string) {
    const session = await this.prisma.user_Sessions.findFirst({
      where: { sid },
      include: { user: { include: { role: true } } },
    });

    const product = await this.prisma.product.findFirst({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException("Product hasn't been found");
    }

    if (
      session.user.role.name !== "Admin" &&
      session.user_id !== product.user_id
    ) {
      throw new BadRequestException(
        "This isn't your product or you aren't admin",
      );
    }

    await this.prisma.product.delete({ where: { id: product.id } });

    return "Product has been deleted";
  }
}
