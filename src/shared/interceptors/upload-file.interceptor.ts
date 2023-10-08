import { FileInterceptor } from "@nestjs/platform-express";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";
import { mkdir } from "fs/promises";
import { diskStorage } from "multer";
import { tmpdir } from "os";
import { extname } from "path";
import { v4 } from "uuid";

export function UploadFileInterceptor(
  field = "file",
  options?: Omit<MulterOptions, "storage" | "dest"> & {
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
    ? FileInterceptor(field, {
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
