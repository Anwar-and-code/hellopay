import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePaymentPlanDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const num = parseInt(value, 10);
      if (!isNaN(num)) return num;
      return value;
    }
    return value;
  })
  numberOfInstallments: number;
  
  @IsInt()
  @IsNotEmpty()
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