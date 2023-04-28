import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop()
  name: string;

  @Prop()
  date: string;

  @Prop()
  description: string;

  @Prop()
  imagePath: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'City' })
  city: {
    type: mongoose.Schema.Types.ObjectId;
    ref: 'City';
  };
}

export const EventSchema = SchemaFactory.createForClass(Event);
