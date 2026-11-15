import { IsMongoId, IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateComentarioDto {

  @IsNotEmpty({ message: 'El ID de la publicación es obligatorio' })
  @IsMongoId({ message: 'El ID de la publicación debe ser un ObjectId válido' })
  publicacionId: string;

  @IsNotEmpty({ message: 'El mensaje no puede estar vacío' })
  @IsString({ message: 'El mensaje debe ser un texto' })
  @MaxLength(300, { message: 'El mensaje no puede superar los 300 caracteres' })
  mensaje: string;

  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsMongoId({ message: 'El ID del usuario debe ser un ObjectId válido' })
  usuarioId: string;
}

