import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { FastifyRequest } from "fastify";

export const Cookies = createParamDecorator((__, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>();
  const sid = request.cookies["sid"].split(".")[0];

  return sid;
});
