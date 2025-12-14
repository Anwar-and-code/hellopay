import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export enum DeliveryStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

export class CreateDeliveryDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  orderId: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  notes?: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lieuxPriseEnCharge: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lieuxLivraison: string;
}