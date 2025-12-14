import { IsString, MinLength, MaxLength, IsOptional, IsInt, Min, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdatePaymentPlanDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = parseInt(value, 10);
      if (!isNaN(num)) return num;
      return value;
    }
    return value;
  })
  numberOfInstallments: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = parseInt(value, 10);
      if (!isNaN(num)) return num;
      return value;
    }
    return value;
  })
  intervalInDays: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description?: string;
}