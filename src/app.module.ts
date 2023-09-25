import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import config from "./config/config";
import { PrismaService } from "./prisma.service";
import { ProductsModule } from "./products/products.module";
import { RolesModule } from "./roles/roles.module";
import { UsersModule } from "./users/users.module";
import { OrderModule } from "./order/order.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ProductsModule,
    UsersModule,
    AuthModule,
    RolesModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
