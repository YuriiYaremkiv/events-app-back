import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CityDocument = HydratedDocument<City>;

@Schema()
export class City {
  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  city: string | { label: string; population: number; country: string };

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, type: mongoose.Schema.Types.Mixed })
  country: string | { name: string; label: string; phone: number };

  @Prop({ required: true })
  population: number;

  @Prop({ default: false })
  showOnHomePage: boolean;

  @Prop({ default: false })
  isHidden: boolean;

  @Prop({ default: '' })
  imagePath: string;

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
    },
  ];
}

export const CitySchema = SchemaFactory.createForClass(City);
