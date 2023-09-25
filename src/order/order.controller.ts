import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { Cookies } from "src/auth/cookie.decorator";
import { Roles } from "src/roles/roles.decorator";
import { Role } from "src/roles/roles.enum";
import { RolesGuard } from "src/roles/roles.guard";
import { CreateOrderDto } from "./dtos/create-order.dto";
import { OrderService } from "./order.service";

@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post("add-cart")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  async addCart(@Cookies() sid: string, @Body() dto: CreateOrderDto) {
    return await this.orderService.addCart(sid, dto);
  }

  @Get("create-payment/:orderId")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.User)
  async createPayment(@Cookies() sid: string, @Param("orderId") id: number) {
    return await this.orderService.createPayment(sid, id);
  }

  @Post("update-status")
  updateStatus(@Body() dto) {
    return this.orderService.updateStatus(dto);
  }
}
