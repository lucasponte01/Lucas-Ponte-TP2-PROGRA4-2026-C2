import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Usuario {
    @Prop({ required: true })
    nombre: string;

    @Prop({ required: true })
    apellido: string;

    @Prop({ required: true, unique: true })
    correo: string;

    @Prop({ required: true, unique: true })
    nombreUsuario: string;

    @Prop({ required: true })
    contrasena: string;

    @Prop({ required: true })
    fechaNacimiento: string;

    @Prop({ default: '' })
    descripcionBreve: string;

    @Prop({ default: '' })
    imagenPerfil: string;

    @Prop({ default: 'usuario', enum: ['usuario', 'administrador'] })
    perfil: string;
}

export const UserSchema = SchemaFactory.createForClass(Usuario);