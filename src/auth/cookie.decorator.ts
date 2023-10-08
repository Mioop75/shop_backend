import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";

export const Cookies = createParamDecorator((__, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  const sid = request.cookies["sid"].split(".")[0];

  return sid;
});
