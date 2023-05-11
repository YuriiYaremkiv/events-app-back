import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { City } from './city.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' })
  cityId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [Object], required: true })
  events: [
    {
      id: string;
      title: string;
      description: string;
      date: string;
      seats: string;
      imagePath: string;
    },
  ];
}

export const EventSchema = SchemaFactory.createForClass(Event);
