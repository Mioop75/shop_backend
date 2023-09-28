import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
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
import { CreateOrderDto } from "./dtos/create-order.dto";
import { OrderDto } from "./dtos/order.dto";
import { OrderService } from "./order.service";

@ApiTags("orders")
@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get("get-orders")
  @UseInterceptors(InjectUserInterceptor)
  async getMyOrder(@CurrentUser("id") userId: number) {
    const orders = await this.getMyOrder(userId);
    return plainToInstance(OrderDto, orders);
  }

  @Post("add-cart")
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(InjectUserInterceptor)
  @Roles(Role.User)
  async addCart(
    @CurrentUser("id") userId: number,
    @Body() dto: CreateOrderDto,
  ) {
    return await this.orderService.addCart(userId, dto);
  }

  @Delete("delete-order/:id")
  deleteOrder(@Param("id", ParseIntPipe) id: number) {
    return this.orderService.deleteOrder(id);
  }

  @Get("create-payment/:orderId")
  @UseGuards(AuthGuard, RolesGuard)
  @UseInterceptors(InjectUserInterceptor)
  @Roles(Role.User)
  async createPayment(
    @CurrentUser("id") userId: number,
    @Param("orderId") id: number,
  ) {
    return await this.orderService.createPayment(userId, id);
  }

  @Post("update-status")
  updateStatus(@Body() dto) {
    return this.orderService.updateStatus(dto);
  }
}
