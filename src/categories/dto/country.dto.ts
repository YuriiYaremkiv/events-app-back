import {
  IsString,
  MinLength,
  MaxLength,
  Min,
  Max,
  IsNotEmpty,
  Length,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformUtils } from '../../utils/transform.values';

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

export class CountryDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 6)
  code: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  label: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  phone: string;

  @IsOptional()
  cities: any;
}
