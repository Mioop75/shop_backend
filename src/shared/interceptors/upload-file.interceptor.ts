import {
  CallHandler,
  ExecutionContext,
  Inject,
  NestInterceptor,
  Optional,
  Type,
  mixin,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import FastifyMulter from "fastify-multer";
import { mkdir } from "fs/promises";
import { Multer, Options, diskStorage } from "multer";
import { tmpdir } from "os";
import { extname } from "path";
import { Observable } from "rxjs";
import { v4 } from "uuid";

type MulterInstance = any;
function FastifyFileInterceptor(
  fieldName: string,
  localOptions: Options,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;

    constructor(
      @Optional()
      @Inject("MULTER_MODULE_OPTIONS")
      options: Multer,
    ) {
      this.multer = (FastifyMulter as any)({ ...options, ...localOptions });
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      await new Promise<void>((resolve, reject) =>
        this.multer.single(fieldName)(
          ctx.getRequest(),
          ctx.getResponse(),
          (error: any) => {
            if (error) {
              // const error = transformException(err);
              return reject(error);
            }
            resolve();
          },
        ),
      );

      return next.handle();
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}

function FastifyFilesInterceptor(
  fieldName: string,
  maxCount?: number,
  localOptions?: Options,
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    protected multer: MulterInstance;

    constructor(
      @Optional()
      @Inject("MULTER_MODULE_OPTIONS")
      options: Multer,
    ) {
      this.multer = (FastifyMulter as any)({ ...options, ...localOptions });
    }

    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const ctx = context.switchToHttp();

      await new Promise<void>((resolve, reject) =>
        this.multer.array(fieldName, maxCount)(
          ctx.getRequest(),
          ctx.getResponse(),
          (error: any) => {
            if (error) {
              // const error = transformException(err);
              return reject(error);
            }
            resolve();
          },
        ),
      );

      return next.handle();
    }
  }
  const Interceptor = mixin(MixinInterceptor);
  return Interceptor as Type<NestInterceptor>;
}

export function UploadFileInterceptor(
  field = "file",
  options?: Omit<Options, "storage" | "dest"> & {
    /**
     * - [YYYY] will be replace to current year
     * - [MM] will be replace to current month
     */
    dest: string;
  },
) {
  //
  // FileInterceptor
  return options
    ? FastifyFileInterceptor(field, {
        ...options,
        storage: diskStorage({
          destination: async (_req, _file, callback) => {
            const date = new Date();

            const replaceMap = {
              "[YYYY]": date.getFullYear(),
              "[MM]": (date.getMonth() + 1).toString().padStart(2, "0"),
            };

            let uploadFolder = options.dest || tmpdir();

            Object.entries(replaceMap).forEach(
              ([searchValue, replaceValue]) => {
                uploadFolder = uploadFolder.replaceAll(
                  `${searchValue}`,
                  `${replaceValue}`,
                );
              },
            );

            await mkdir(uploadFolder, { recursive: true });

            return callback(null, uploadFolder);
          },

          filename(_req, file, callback) {
            const uploadedFile = v4() + extname(file.originalname);

            callback(null, uploadedFile);
          },
        }),
      })
    : FileInterceptor(field);
}

export function UploadFilesInterceptor(
  field = "files",
  count = 2,
  options?: Omit<Options, "storage" | "dest"> & {
    /**
     * - [YYYY] will be replace to current year
     * - [MM] will be replace to current month
     */
    dest: string;
  },
) {
  //
  // FileInterceptor
  return options
    ? FastifyFilesInterceptor(field, count, {
        ...options,
        storage: diskStorage({
          destination: async (_req, _file, callback) => {
            const date = new Date();

            const replaceMap = {
              "[YYYY]": date.getFullYear(),
              "[MM]": (date.getMonth() + 1).toString().padStart(2, "0"),
            };

            let uploadFolder = options.dest || tmpdir();

            Object.entries(replaceMap).forEach(
              ([searchValue, replaceValue]) => {
                uploadFolder = uploadFolder.replaceAll(
                  `${searchValue}`,
                  `${replaceValue}`,
                );
              },
            );

            await mkdir(uploadFolder, { recursive: true });

            return callback(null, uploadFolder);
          },

          filename(_req, file, callback) {
            const uploadedFile = v4() + extname(file.originalname);

            callback(null, uploadedFile);
          },
        }),
      })
    : FileInterceptor(field);
}
