import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

@Schema()
export class City {
  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  country: { name: string; label: string; phone: number };

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  city: { label: string; population: number; country: string };

  @Prop({ default: '' })
  description: string;

  @Prop({ default: '' })
  imagePath: string;

  @Prop({ default: false })
  showOnHomePage: boolean;

  @Prop({ default: false })
  isHidden: boolean;

  @Prop()
  events: Array<any>;
}

export const CitySchema = SchemaFactory.createForClass(City);
export type CityDocument = HydratedDocument<City>;
