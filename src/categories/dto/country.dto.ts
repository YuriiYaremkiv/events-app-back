import { IsString, IsNotEmpty, Length, IsOptional } from 'class-validator';

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

export class UpdatedCountryDto extends CountryDto {
  _id: string;
}
