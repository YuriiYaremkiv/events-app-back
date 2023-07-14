import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  IsString,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsNotEmpty,
  Length,
  IsInt,
} from 'class-validator';
import { Document, Schema as MongooseSchema } from 'mongoose';

class CityItem {
  @IsString()
  @MinLength(2)
  @MaxLength(75)
  label: string;

  @IsInt()
  @Min(1)
  @Max(30000000)
  population: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 75)
  country: string;
}

@Schema()
export class Country {
  @Prop({ required: true, unique: true })
  @Length(2, 6)
  code: string;

  @Prop({ required: true, unique: true })
  @Length(2, 75)
  label: string;

  @Prop({ required: true, unique: true })
  @Length(2, 75)
  phone: string;

  @Prop()
  cities: any[];
}

export const CountrySchema = SchemaFactory.createForClass(Country);
export type CountryDocument = Country & Document;
