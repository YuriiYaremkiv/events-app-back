import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CityDocument = HydratedDocument<City>;

@Schema()
export class City {
  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  city: string | { label: string; population: number; country: string };

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  country: string | { name: string; label: string; phone: number };

  @Prop({ required: true })
  population: number;

  @Prop({ default: false })
  showOnHomePage: boolean;

  @Prop({ default: '' })
  imagePath: string;

  @Prop()
  events: any[];
}

export const CitySchema = SchemaFactory.createForClass(City);
