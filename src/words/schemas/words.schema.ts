import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WordDocument = HydratedDocument<Word>;

@Schema()
export class Word {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop({ required: true })
  dateLearned: Date;

  @Prop({ required: true })
  path: string;
}

export const WordSchema = SchemaFactory.createForClass(Word);
