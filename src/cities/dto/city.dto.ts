import {
  Min,
  Max,
  IsInt,
  Length,
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformUtils } from '../../utils/transform.values';

class CountryData {
  @IsNotEmpty()
  @IsString()
  @Length(2, 6)
  code: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 75)
  label: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 75)
  phone: string;
}

class CityData {
  @IsNotEmpty()
  @IsString()
  @Length(2, 75)
  label: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(30000000)
  @Transform(TransformUtils.stringToNumberInt)
  population: number;

  @IsNotEmpty()
  @IsString()
  @Length(2, 75)
  country: string;
}

export class CityDto {
  readonly _id: string;

  @IsNotEmpty()
  @Transform(TransformUtils.stringToObject)
  readonly country: CountryData;

  @IsNotEmpty()
  @Transform(TransformUtils.stringToObject)
  readonly city: CityData;

  @IsNotEmpty()
  @Min(1)
  @Max(5)
  @Transform(TransformUtils.stringToNumberFloat)
  readonly rating: number;

  @IsNotEmpty()
  @IsString()
  @Length(6, 300)
  readonly description: string;

  @IsString()
  @IsOptional()
  imagePath?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(1000)
  @Transform(TransformUtils.stringToNumberInt)
  readonly priorityDisplay: number;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(TransformUtils.stringToBoolean)
  readonly showOnHomePage: string;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(TransformUtils.stringToBoolean)
  readonly isHidden: string;
}
