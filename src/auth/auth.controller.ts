import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { FastifyReply } from "fastify";
import { UserDto } from "../users/dtos/user.dto";
import { AuthDto } from "./auth.dto";
import { AuthGuard } from "./auth.guard";
import { AuthService } from "./auth.service";
import { Cookies } from "./cookie.decorator";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { user, sid } = await this.authService.register(dto);
    res.setCookie("sid", sid, {
      path: "/api/",
      signed: true,
      httpOnly: true,
      maxAge: 42000,
      secure: true,
    });
    return plainToInstance(UserDto, user);
  }

  @Post("login")
  async login(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { user, sid } = await this.authService.login(dto);
    res.setCookie("sid", sid, {
      path: "/api/",
      signed: true,
      httpOnly: true,
      maxAge: 42000,
      secure: true,
    });
    return plainToInstance(UserDto, user);
  }

  @Get("logout")
  @UseGuards(AuthGuard)
  async logout(
    @Cookies() sid: string,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const session = await this.authService.logout(sid);
    res.cookie("sid", null, { path: "/api/", maxAge: -1 });
    return session;
  }
}
