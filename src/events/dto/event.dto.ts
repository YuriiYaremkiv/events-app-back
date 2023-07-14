import {
  Min,
  Max,
  IsInt,
  Length,
  IsEmail,
  IsString,
  IsBoolean,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformUtils } from '../../utils/transform.values';

class speakerData {
  @IsNotEmpty()
  @IsString()
  @Length(6, 75)
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 75)
  lastname: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100_000)
  @Transform(TransformUtils.stringToNumber)
  age: number;

  @IsNotEmpty()
  @IsString()
  @Length(6, 75)
  about: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 75)
  topic: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 75)
  telephone: string;
}

class categoriesData {
  @IsNotEmpty()
  @IsString()
  @Length(6, 75)
  label: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 75)
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
