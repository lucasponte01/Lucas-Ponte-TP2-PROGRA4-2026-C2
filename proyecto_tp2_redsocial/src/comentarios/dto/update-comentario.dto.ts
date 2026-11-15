import { PartialType } from '@nestjs/mapped-types';
import { CreateComentarioDto } from './create-comentario.dto.js';
import { IsMongoId, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateComentarioDto extends PartialType(CreateComentarioDto) {
    @IsNotEmpty({ message: 'El mensaje no puede estar vacío' })
    @IsString({ message: 'El mensaje debe ser un texto' })
    @MaxLength(300, { message: 'El mensaje no puede superar los 300 caracteres' })
    mensaje: string;

    @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
    usuarioId: string;
}
