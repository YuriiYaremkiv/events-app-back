import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';

export type CatDocument = HydratedDocument<Event>;

@Schema({ timestamps: true })
export class Event {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' })
  cityId: {
    type: mongoose.Schema.Types.ObjectId;
    ref: 'City';
  };

  @Prop()
  events: [
    {
      title: string;
      description: string;
      date: string;
      seats: string;
    },
  ];
}

export const EventSchema = SchemaFactory.createForClass(Event);
