import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Publicacione {

@Prop({ required: true })
titulo!: string;

@Prop({ required: true })
mensaje!: string;

@Prop()
imagen?: string;

}
export const PubliSchema = SchemaFactory.createForClass(Publicacione);