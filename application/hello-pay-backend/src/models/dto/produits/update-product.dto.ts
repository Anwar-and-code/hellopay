import { IsString, MinLength, MaxLength, IsOptional, IsInt, Min, IsNumber, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      const n = parseFloat(value);
      return isNaN(n) ? value : n;
    }
    return value;
  })
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  description?: string;

  
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  imageUrl: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  categoryId?: string;

  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  supplierId?: string;
}