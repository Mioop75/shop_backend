import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FastifyRequest } from "fastify";
import { PrismaService } from "../prisma.service";
import { ROLES_KEY } from "./roles.decorator";
import { Role } from "./roles.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return false;
      }

      const sid = context
        .switchToHttp()
        .getRequest<FastifyRequest>()
        .cookies["sid"].split(".")[0];

      const session = await this.prisma.user_Sessions.findFirstOrThrow({
        where: { sid },
        include: { user: { include: { role: true } } },
      });

      return requiredRoles.some((role) => role == session.user.role.name);
    } catch (error) {
      return false;
    }
  }
}
