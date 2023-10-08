import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { compare, genSalt, hash } from "bcryptjs";
import { unlink } from "fs/promises";
import { PrismaService } from "../prisma.service";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { InputUserDto } from "./dtos/input-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: InputUserDto, role_id: number = 1) {
    const salt = await genSalt(8);
    const hashedPassword = await hash(dto.password, salt);

    if (role_id === 3) {
      const userWithAdmin = await this.prisma.user.findFirst({
        where: { role_id: 3 },
      });

      if (userWithAdmin) {
        throw new BadRequestException("Admin already exists");
      }
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        description: dto.description,
        password: hashedPassword,
        role_id,
      },
      include: { role: true },
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
    const user = await this.prisma.user.findFirst({
      where: { name },
      include: { role: true },
    });

    if (!user) {
      throw new NotFoundException("User hasn't been found");
    }

    return user;
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findFirst({ where: { id } });

    if (!user) {
      throw new NotFoundException("User hasn't been found");
    }

    return user;
  }

  async updateUser(
    id: number,
    dto: Pick<InputUserDto, "email" | "name" | "description">,
    photo?: Express.Multer.File,
  ) {
    const oldUser = await this.getUserById(id);

    if (oldUser.avatar) {
      await unlink(oldUser.avatar);
    }

    const user = await this.prisma.user.update({
      where: { id: oldUser.id },
      data: {
        avatar: photo?.path,
        email: dto.email,
        name: dto.name,
        description: dto.description,
      },
    });

    return user;
  }

  async changePassword(id: number, passwords: ChangePasswordDto) {
    const user = await this.getUserById(id);

    const verifiedPassword = await compare(
      passwords.oldPassword,
      user.password,
    );

    if (!verifiedPassword) {
      throw new UnauthorizedException("Wrong password");
    }

    const salt = await genSalt(8);

    const hashedPassword = await hash(passwords.newPassword, salt);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return "Password has been changed";
  }

  async updateUserByAdmin(
    id: number,
    dto: InputUserDto,
    photo: Express.Multer.File,
  ) {
    const oldUser = await this.prisma.user.findFirst({ where: { id } });

    if (oldUser.avatar) {
      await unlink(oldUser.avatar);
    }

    if (!oldUser) {
      throw new NotFoundException("User hasn't found");
    }

    const user = await this.prisma.user.update({
      where: { id: oldUser.id },
      data: {
        avatar: photo?.path,
        email: dto.email,
        name: dto.name,
        description: dto.description,
      },
    });

    return user;
  }

  async deleteUserByAdmin(id: number) {
    const user = await this.prisma.user
      .findFirstOrThrow({ where: { id } })
      .catch(() => {
        throw new NotFoundException("User hasn't been found");
      });

    if (user.avatar) {
      await unlink(user.avatar);
    }

    await this.prisma.user.delete({ where: { id } });
    return "Account has deleted";
  }
}
