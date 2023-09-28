import { Module } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
  imports: [UsersModule],
})
export class AuthModule {}
