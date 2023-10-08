import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Request } from "express";
import { PrismaService } from "../prisma.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const sid = request.cookies["sid"].split(".")[0];

      await this.prisma.user_Sessions.findUniqueOrThrow({
        where: { sid },
      });

      return true;
    } catch (error) {
      return false;
    }
  }
}
