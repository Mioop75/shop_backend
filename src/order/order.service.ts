import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Product } from "@prisma/client";
import * as YooKassa from "yookassa";
import { PrismaService } from "../prisma.service";
import { CreateOrderDto } from "./dtos/create-order.dto";

const yooKassa = new YooKassa({
  shopId: process.env.SHOP_ID,
  secretKey: process.env.SHOP_SECRET_KEY,
});

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async getMyOrders(userId: number) {
    const orders = await this.prisma.order.findFirst({
      where: { userId: userId },
      include: { orders_items: { include: { product: true } } },
    });
    return orders;
  }

  async createOrder(userId: number, products: Product[]) {
    const oldOrder = await this.prisma.order.findFirst({
      where: { userId: userId },
    });

    const total = products.reduce((accumulator, currentValue) => {
      return accumulator + currentValue.price;
    }, 0);

    if (oldOrder) {
      return await this.prisma.order.update({
        where: { id: oldOrder.id },
        data: { total },
      });
    }

    return await this.prisma.order.create({
      data: { userId: userId, total },
    });
  }

  async addCart(userId: number, dto: CreateOrderDto) {
    // Again change method

    const user = await this.prisma.user.findFirst({
      where: { id: userId },
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

    const order = await this.createOrder(user.id, products);

    await this.prisma.order_Item.createMany({
      data: products.map((product) => {
        return { orderId: order.id, product_id: product.id };
      }),
      skipDuplicates: true,
    });

    return "Product has been added to your cart";
  }

  async deleteOrder(orderId: number) {
    const order = await this.prisma.order.findFirst({ where: { id: orderId } });

    if (order.status !== "Pending") {
      throw new BadRequestException(
        "You can't delete order with status Payed or Rejected",
      );
    }

    return "Order has been deleted";
  }

  async createPayment(userId: number, orderId: number) {
    const user = await this.prisma.user.findFirst({
      where: { id: userId },
      include: {
        orders: true,
      },
    });

    const order = await this.prisma.order.findFirst({
      where: { id: orderId },
      include: { orders_items: true },
    });

    if (user.id !== order.userId) {
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
