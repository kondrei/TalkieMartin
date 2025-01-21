import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WordDocument = HydratedDocument<Word>;

@Schema()
export class WordData {
  @Prop({ required: true })
  dateLearned: Date;

  @Prop({ required: true })
  path: string;
}

@Schema()
export class Word {
  @Prop({ required: true, unique: true, index: true })
  name: string;

  @Prop({ type: [WordData], default: [] })
  wordData: WordData[];
}

export const WordSchema = SchemaFactory.createForClass(Word);
