import {
  IsBoolean,
  IsString,
  Length,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformUtils } from '../../utils/transform.values';

class speakerData {
  firstname: string;
  lastname: string;
  age: number;
  about: string;
  email: string;
  topic: string;
  telephone: string;
}

class categoriesData {
  label: string;
  color: string;
}

export class EventDto {
  @IsString()
  @IsOptional()
  @Length(6, 75)
  readonly id?: string;

  @IsString()
  @IsOptional()
  @Length(6, 75)
  readonly eventId?: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 75)
  readonly cityId: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 300)
  readonly description: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 75)
  readonly date: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100_000)
  @Transform(TransformUtils.stringToNumber)
  readonly seats: number;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100_000)
  @Transform(TransformUtils.stringToNumber)
  readonly price: number;

  @IsNotEmpty()
  @Transform(TransformUtils.stringToObject)
  readonly categories: categoriesData[];

  @IsNotEmpty()
  @Transform(TransformUtils.stringToObject)
  readonly speakers: speakerData[];

  @IsString()
  @IsOptional()
  readonly imagePath?: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 75)
  readonly language: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(TransformUtils.stringToNumber)
  readonly minAge: number;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(TransformUtils.stringToBoolean)
  readonly showOnHomePage: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(TransformUtils.stringToBoolean)
  readonly showInCityHome: boolean;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(TransformUtils.stringToBoolean)
  readonly isHidden: boolean;
}
