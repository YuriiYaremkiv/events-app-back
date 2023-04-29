import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
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
