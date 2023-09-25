import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  imports: [UsersModule],
})
export class AuthModule {}
