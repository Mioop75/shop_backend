import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiBody, ApiTags } from "@nestjs/swagger";
import { plainToInstance } from "class-transformer";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/roles/roles.decorator";
import { Role } from "src/roles/roles.enum";
import { RolesGuard } from "src/roles/roles.guard";
import { InjectUserInterceptor } from "src/shared/interceptors/InjectUser.interceptor";
import { UploadFileInterceptor } from "src/shared/interceptors/upload-file.interceptor";
import { ChangePasswordDto } from "./dtos/change-password.dto";
import { InputUserDto } from "./dtos/input-user.dto";
import { UserDto } from "./dtos/user.dto";
import { CurrentUser } from "./user.decorator";
import { UsersService } from "./users.service";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("users/:name")
  async getUser(@Param("name") name: string) {
    const user = await this.getUser(name);
    return plainToInstance(UserDto, user);
  }

  @Get("get-sellers")
  async getAllSellers() {
    const users = await this.usersService.getAllSellers();
    return plainToInstance(UserDto, users);
  }

  @Put()
  @ApiBody({
    type: "multipart/form-data",
    required: true,
    schema: {
      type: "object",
      properties: {
        img: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(
    UploadFileInterceptor("avatar", { dest: "uploads/avatars/[YYYY]/[MM]" }),
  )
  @UseInterceptors(InjectUserInterceptor)
  @UseGuards(AuthGuard)
  async updateUser(
    @CurrentUser("id") id: number,
    @Body() dto: InputUserDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    const user = await this.usersService.updateUser(id, dto, photo);
    return plainToInstance(UserDto, user);
  }

  @Patch()
  @UseInterceptors(InjectUserInterceptor)
  @UseGuards(AuthGuard)
  async changePassword(
    @CurrentUser("id") id: number,
    @Body() passwords: ChangePasswordDto,
  ) {
    return await this.usersService.changePassword(id, passwords);
  }

  // Admin
  @Put("admin/update/:userId")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBody({
    type: "multipart/form-data",
    required: true,
    schema: {
      type: "object",
      properties: {
        img: {
          type: "string",
          format: "binary",
        },
      },
    },
  })
  @UseInterceptors(
    UploadFileInterceptor("avatar", { dest: "uploads/avatars/[YYYY]/[MM]" }),
  )
  async updateUserByAdmin(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() dto: InputUserDto,
    @UploadedFile() photo: Express.Multer.File,
  ) {
    const user = await this.usersService.updateUserByAdmin(userId, dto, photo);
    return plainToInstance(UserDto, user);
  }

  @Delete("admin/delete/:userId")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  deleteUserByAdmin(@Param("userId", ParseIntPipe) userId: number) {
    return this.deleteUserByAdmin(userId);
  }
}
