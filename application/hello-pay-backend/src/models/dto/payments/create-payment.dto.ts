import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, Min, MaxLength } from 'class-validator';
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

export class CreatePaymentDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  orderId: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  installmentId?: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  payementType: string;



  @IsNotEmpty()
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  code_otp: string;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
}