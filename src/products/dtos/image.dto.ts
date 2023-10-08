import { Expose } from "class-transformer";

export class ImageDto {
  @Expose()
  path: string;
  @Expose()
  fieldname: string;
  @Expose()
  originalname: string;
}
