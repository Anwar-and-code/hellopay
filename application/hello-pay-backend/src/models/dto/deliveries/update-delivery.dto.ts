import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export enum DeliveryStatus {
  PENDING = 'PENDING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
}

export class UpdateDeliveryDto {
  @IsOptional()
  @IsEnum(DeliveryStatus)
  deliveryStatus?: DeliveryStatus;

  @IsOptional()
  @IsDateString()
  deliveredAt?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  notes?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lieuxPriseEnCharge: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  lieuxLivraison: string;
}