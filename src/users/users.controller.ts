import { Controller, Delete, Get, Param, Put } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { InputUserDto } from "./dtos/input-user.dto";
import { UserDto } from "./dtos/user.dto";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("users/:id")
  async getUser(@Param() id: number) {
    const user = await this.getUser(id);
    return plainToInstance(UserDto, user);
  }

  @Get("get-sellers")
  async getAllSellers() {
    const users = await this.usersService.getAllSellers();
    return plainToInstance(UserDto, users);
  }

  @Put()
  async updateUser(userId: number, dto: InputUserDto) {
    const user = await this.usersService.updateUser(userId, dto);
    return plainToInstance(UserDto, user);
  }

  // Admin
  @Put("admin/update/:userId")
  async updateUserByAdmin(userId: number, dto: InputUserDto) {
    const user = await this.usersService.updateUserByAdmin(userId, dto);
    return plainToInstance(UserDto, user);
  }

  @Delete("admin/delete/:userId")
  deleteUserByAdmin(userId: number) {
    return this.deleteUserByAdmin(userId);
  }
}
