import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { AuthModule } from "./auth/auth.module";
import config from "./config/config";
import { OrderModule } from "./order/order.module";
import { ProductsModule } from "./products/products.module";
import { RolesModule } from "./roles/roles.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "uploads"),
      serveRoot: "/uploads",
      exclude: ["/api*"],
    }),
    ProductsModule,
    UsersModule,
    AuthModule,
    RolesModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
