import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' })
  cityId: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [], required: true })
  events: [
    {
      id: string;
      title: string;
      description: string;
      date: string;
      seats: number;
      price: number;
      categories: [];
      imagePath: string;
    },
  ];
}

export const EventSchema = SchemaFactory.createForClass(Event);
