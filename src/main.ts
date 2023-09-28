import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import fastifyCsrfProtection from "@fastify/csrf-protection";
import fastifyHelmet from "@fastify/helmet";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { contentParser } from "fastify-multer";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma.service";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const config = app.get(ConfigService);
  const PORT = config.get("PORT") || 5000;

  app.get(PrismaService);

  app.register(fastifyCookie, { secret: config.get("SECRET") });
  app.register(fastifyHelmet);
  app.register(fastifyCsrfProtection);
  app.register(fastifyCors, { credentials: true });
  app.register(contentParser);

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      whitelist: true,
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      enableImplicitConversion: true,
      strategy: "excludeAll",
    }),
  );

  app.setGlobalPrefix("api");

  const swaggerConfig = new DocumentBuilder()
    .setTitle("Shop")
    .setDescription("The api shop")
    .setVersion("1.0")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api", app, document);

  await app.listen(PORT, "0.0.0.0", async () =>
    console.log(`Server is running on: ${await app.getUrl()}`),
  );
}
bootstrap();
