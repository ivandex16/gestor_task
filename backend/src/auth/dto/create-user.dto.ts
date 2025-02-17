import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsEnum,
  IsArray,
  IsEmail,
  Min,
  Max,
  IsBoolean,
  MinLength,
  MaxLength,
  IsDefined,
} from 'class-validator';

export class CreateUserDto {
  id: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(16)
  password: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsOptional()
  @IsBoolean()
  isActive: boolean = true;

  // @IsDate()
  // created_at: Date;

  // @IsDate()
  // update_at: Date;
}
