import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Event, EventDocument } from './event.schema';

export type CityDocument = HydratedDocument<City>;

@Schema()
export class City {
  @Prop({ required: true, unique: true })
  city: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  country: string;

  @Prop({ required: true })
  population: number;

  @Prop({ default: false })
  showOnHomePage: boolean;

  @Prop({ default: '' })
  imagePath: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }] })
  events: Event[];
}

export const CitySchema = SchemaFactory.createForClass(City);
