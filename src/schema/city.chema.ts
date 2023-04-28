import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class City extends Document {
  @Prop()
  city: string;

  @Prop()
  country: string;

  @Prop()
  population: number;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Event' })
  // events: {
  //   type: mongoose.Schema.Types.ObjectId;
  //   ref: 'Event';
  // };
}

export const CitySchema = SchemaFactory.createForClass(City);
