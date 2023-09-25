import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compare } from "bcryptjs";
import { PrismaService } from "src/prisma.service";
import { UsersService } from "src/users/users.service";
import { AuthDto } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: AuthDto) {
    const user = await this.usersService.createUser(dto, dto.roleId);
    const session = await this.prisma.user_Sessions.create({
      data: { sid: `${Date.now()}${user.name}`, user_id: user.id },
    });
    return { user: dto, sid: session.sid };
  }

  async login(dto: Pick<AuthDto, "name" | "password">) {
    const user = await this.usersService.getUser(dto.name);

    const verifiedPassword = await compare(dto.password, user.password);

    if (!verifiedPassword) {
      throw new UnauthorizedException("Wrong password");
    }

    const session = await this.prisma.user_Sessions.create({
      data: { sid: `${Date.now()}${user.name}`, user_id: user.id },
    });

    return { user: dto, sid: session.sid };
  }

  async logout(sid: string) {
    await this.prisma.user_Sessions.delete({ where: { sid } });
    return "Session was deleted";
  }
}
