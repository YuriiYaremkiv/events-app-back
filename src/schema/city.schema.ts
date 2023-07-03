import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CityDocument = HydratedDocument<City>;

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
  events: [
    {
      id?: string;
      eventId?: string;
      cityId: string;
      imagePath?: string;
      title: string;
      description: string;
      date: string;
      seats: number;
      price: number;
      categories: string;
      showOnHomePage: boolean;
      isHidden: boolean;
      showInCityHome: boolean;
      singleEvent: [];
    },
  ];
}

export const CitySchema = SchemaFactory.createForClass(City);
