import { IsString, IsNotEmpty, IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export enum OrderPaymentMode {
  COD = 'COD',
  INSTALLMENT = 'INSTALLMENT',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  PAID = 'PAID',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  userId: string;
  
  @IsEnum(OrderPaymentMode)
  @IsNotEmpty()
  paymentMode: OrderPaymentMode;

  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @IsNotEmpty() 
  paymentPlanId?: string;
  
  @IsNotEmpty()
  orderItems: any[];
}