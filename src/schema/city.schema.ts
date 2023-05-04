import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type CityDocument = HydratedDocument<City>;

@Schema()
export class City {
  @Prop()
  city: string;

  @Prop()
  title: string;

  @Prop()
  country: string;

  @Prop()
  population: number;

  @Prop({ default: false })
  showOnHomePage: boolean;

  @Prop({ default: '' })
  imagePath: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] })
  events: Event[];
}

export const CitySchema = SchemaFactory.createForClass(City);
