import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { genSalt, hash } from "bcryptjs";
import { PrismaService } from "src/prisma.service";
import { InputUserDto } from "./dtos/input-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: InputUserDto, role_id: number = 1) {
    const salt = await genSalt(8);
    const hashedPassword = await hash(dto.password, salt);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        description: dto.description,
        password: hashedPassword,
        role_id,
      },
    });
    return user;
  }

  async getAllSellers() {
    return await this.prisma.user.findMany({
      where: { role_id: 2 },
      include: { role: true },
    });
  }

  async getUser(name: string) {
    const user = await this.prisma.user.findFirst({ where: { name } });

    if (!user) {
      throw new NotFoundException("User hasn't been found");
    }

    return user;
  }

  async updateUser(userId: number, dto: InputUserDto) {
    const oldUser = await this.prisma.user.findFirst({ where: { id: userId } });

    if (!oldUser) {
      throw new NotFoundException("User hasn't been found");
    }

    if (userId !== oldUser.id) {
      throw new UnauthorizedException("This isn't your account");
    }

    const user = await this.prisma.user.update({
      where: { id: oldUser.id },
      data: {
        email: dto.email,
        name: dto.name,
        description: dto.description,
      },
    });

    return user;
  }

  async updateUserByAdmin(id: number, dto: InputUserDto) {
    const oldUser = await this.prisma.user.findFirst({ where: { id } });

    if (!oldUser) {
      throw new NotFoundException("User hasn't found");
    }

    const user = await this.prisma.user.update({
      where: { id: oldUser.id },
      data: {
        email: dto.email,
        name: dto.name,
        description: dto.description,
      },
    });

    return user;
  }

  async deleteUserByAdmin(id: number) {
    await this.prisma.user.delete({ where: { id } });
    return "Account has deleted";
  }
}
