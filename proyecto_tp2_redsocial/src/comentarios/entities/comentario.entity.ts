import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from "mongoose";

@Schema({timestamps:true})
export class Comentario {
    @Prop({ type: Types.ObjectId, ref: 'Publicacion', required: true })
    publicacionId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Usuario', required: true })
    usuario: Types.ObjectId;

    @Prop({ required: true, maxlength: 300 })
    mensaje: string;

    @Prop({ default: false })
    modificado: boolean;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);