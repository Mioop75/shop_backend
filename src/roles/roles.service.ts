import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class RolesService implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}
  async onModuleInit() {
    await this.createRoles();
  }
  async createRoles() {
    const roles = await this.prisma.role.findMany();

    if (roles.length > 0) {
      return false;
    }

    await this.prisma.role.createMany({
      data: [{ name: "User" }, { name: "Seller" }, { name: "Admin" }],
      skipDuplicates: true,
    });
  }
}
