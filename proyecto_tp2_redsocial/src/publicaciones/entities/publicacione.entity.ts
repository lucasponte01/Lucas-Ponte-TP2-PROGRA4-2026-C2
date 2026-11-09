import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Publicacione {

@Prop({ required: true })
titulo!: string;

@Prop({ required: true })
mensaje!: string;

@Prop()
imagen?: string;

@Prop({ type: Types.ObjectId, ref: 'User', required: false })
  usuario?: Types.ObjectId;

@Prop({ default: 0 })
  likesCount!: number;

@Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likes!: Types.ObjectId[];

@Prop({ default: true })
  activo!: boolean;
}
export const PubliSchema = SchemaFactory.createForClass(Publicacione);