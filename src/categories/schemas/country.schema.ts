import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Length } from 'class-validator';
import { Document } from 'mongoose';

@Schema()
export class Country {
  @Prop({ required: true, unique: true })
  @Length(2, 6)
  code: string;

  @Prop({ required: true, unique: true })
  @Length(2, 75)
  label: string;

  @Prop({ required: true, unique: true })
  @Length(2, 75)
  phone: string;

  @Prop()
  cities: any[];
}

export const CountrySchema = SchemaFactory.createForClass(Country);
export type CountryDocument = Country & Document;
