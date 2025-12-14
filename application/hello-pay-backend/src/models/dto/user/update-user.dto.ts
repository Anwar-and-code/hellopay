import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength, IsDateString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export enum UserRole {
  admin = 'admin',
  client = 'client',
}

export class UpdateUserDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(1)
  @IsOptional()
  @MaxLength(255)
  name: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
  @IsEmail()
  @MinLength(5)
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  passwordHash: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  phone: string;


  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;


  @IsDateString()
  @IsNotEmpty()
  dateNaissance: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nom: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(150)
  prenom: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(45)
  job: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MaxLength(45)
  habitation: string;
}