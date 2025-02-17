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

export class LoginUserDto {
  @IsDefined({ message: "El email es obligatorio" })
  @IsNotEmpty({ message: "El email no puede estar vacío" })
  @IsEmail({}, { message: "El email no es válido" })
  @IsString({ message: "El email debe ser una cadena de texto" })
  email: string;

  @IsDefined({ message: "La contraseña es obligatoria" })
  @IsString({ message: "La contraseña debe ser una cadena de texto" })
  @IsNotEmpty({ message: "La contraseña no puede estar vacía" })
  @MinLength(6, { message: "La contraseña debe tener al menos 6 caracteres" })
  @MaxLength(16, { message: "La contraseña no puede tener más de 16 caracteres" })
  password: string;
}
