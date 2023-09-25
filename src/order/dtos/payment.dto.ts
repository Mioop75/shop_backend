import { Type } from "class-transformer";
import { IsObject, IsString, ValidateNested } from "class-validator";

class AmountPayment {
  @IsString()
  value: string;
  @IsString()
  currency: string;
}

class PaymentMethod {
  type: string;
  id: number;
  saved: boolean;
  title: string;
  card: object;
}

class ObjectPayment {
  @IsString()
  id: string;
  status: string;
  @IsString()
  @IsObject()
  @ValidateNested()
  @Type(() => AmountPayment)
  amount: AmountPayment;
  @IsString()
  @IsObject()
  @ValidateNested()
  @Type(() => PaymentMethod)
  payment_method: PaymentMethod;
  @IsString()
  created_at: string;
  @IsString()
  expires_at: string;
  @IsString()
  description: string;
}

export class PaymentStatusDto {
  @IsString()
  event:
    | "payment.succeeded"
    | "payment.waiting_for_capture"
    | "payment.canceled"
    | "refund.succeeded";
  @IsString()
  type: string;
  @IsObject()
  @ValidateNested()
  @Type(() => ObjectPayment)
  object: ObjectPayment;
}
