import { IsNotEmpty, IsOptional, IsString } from "class-validator";


export class CreatePublicacioneDto {
 
  @IsString()
  @IsNotEmpty({ message: 'El título es obligatorio' })
  titulo!: string;

  @IsString()
  @IsNotEmpty({ message: 'El mensaje es obligatorio' })
  mensaje!: string;

  @IsString()
  @IsOptional()
  imagen?: string;
}

