import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El identificador es obligatorio' })
  @IsString()
  identificador: string; // Correo o nombre de usuario

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  contrasena: string;
}