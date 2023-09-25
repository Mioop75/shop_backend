import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma.service";
import * as YooKassa from "yookassa";
import { CreateOrderDto } from "./dtos/create-order.dto";

const yooKassa = new YooKassa({
  shopId: process.env.SHOP_ID,
  secretKey: process.env.SHOP_SECRET_KEY,
});

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyOrders(sid: string) {}

  async addCart(sid: string, dto: CreateOrderDto) {
    // Again change method

    const session = await this.prisma.user_Sessions.findFirst({
      where: { sid },
    });

    const products = await this.prisma.product.findMany({
      where: { id: { in: dto.productIds } },
    });

    if (products.length !== dto.productIds.length) {
      throw new BadRequestException("Products don't equal dto");
    }

    products.map((product) => {
      if (product.available < 1) {
        throw new BadRequestException("The available of product equels 0");
      }
    });

    const total = products.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price;
    }, 0);

    const order = await this.prisma.order.create({
      data: { user_id: session.user_id, total },
    });

    await this.prisma.order_Item.createMany({
      data: products.map((product) => {
        return { orderId: order.id, product_id: product.id };
      }),
      skipDuplicates: true,
    });

    return "Product has been added to your cart";
  }

  async createPayment(sid: string, orderId: number) {
    const include: Prisma.User_SessionsInclude = {
      user: {
        include: {
          Order: {
            include: { orders_items: { include: { product: true } } },
          },
        },
      },
    };

    const session = await this.prisma.user_Sessions.findFirst({
      where: { sid },
      include: include,
    });

    const order = await this.prisma.order.findFirst({
      where: { id: orderId },
      include: { orders_items: true },
    });

    if (session.user_id !== order.user_id) {
      throw new UnauthorizedException("You aren't logged");
    }

    const payment = await yooKassa.createPayment({
      amount: {
        value: order.total.toFixed(2),
        currency: "RUB",
      },
      payment_method_data: {
        type: "bank_card",
      },
      confirmation: {
        type: "redirect",
        return_url: "google.com",
      },
      description: `Order #${order.id}`,
    });

    return payment.confirmation.confirmation_url;
  }

  async updateStatus(dto) {
    if (dto.event === "payment.waiting_for_capture") {
      const payment = await yooKassa.capturePayment(dto.object.id);
      return payment;
    }

    if (dto.event === "payment.succeeded") {
      const orderId = +dto.object.description.split("#")[1];
      await this.prisma.order.update({
        where: { id: orderId },
        data: { status: "Payed" },
      });
      return true;
    }

    return true;
  }
}
