import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";


export class CreateUsuarioDto {
@IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  nombre: string;

  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString({ message: 'El apellido debe ser un texto' })
  apellido: string;

  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail({}, { message: 'El formato del correo no es válido' })
  correo: string;

  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @IsString({ message: 'El nombre de usuario debe ser un texto' })
  nombreUsuario: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos una letra mayúscula y un número',
  })
  contrasena: string;

  @IsNotEmpty({ message: 'La fecha de nacimiento es obligatoria' })
  @IsString()
  fechaNacimiento: string;

  @IsOptional()
  @IsString()
  descripcionBreve?: string;

  @IsOptional()
  @IsString()
  imagenPerfil?: string;

  @IsOptional()
  @IsString()
  perfil?: string;
}
