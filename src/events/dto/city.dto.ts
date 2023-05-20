import { IsNotEmpty, IsString } from 'class-validator';

export class CityDto {
  @IsString()
  readonly _id?: string;

  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @IsNotEmpty()
  @IsString()
  readonly population: number;

  @IsNotEmpty()
  @IsString()
  readonly showOnHomePage: boolean;

  @IsString()
  readonly imagePath?: string = '';
}
