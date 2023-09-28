import { User } from "@prisma/client";

declare module "fastify" {
  export interface FastifyReply {
    user?: User;
  }
}
