import { IsString, IsEnum, IsOptional, IsNumber, Min, MaxLength, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export enum PaymentMethod {
  MOBILE_MONEY = 'MOBILE_MONEY',
  CARD = 'CARD',
  CASH = 'CASH',
}

export enum PaymentStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  PENDING = 'PENDING'
}

export class UpdatePaymentDto {
  @IsNotEmpty()
  @IsEnum(PaymentStatus)
  status: PaymentStatus;
}