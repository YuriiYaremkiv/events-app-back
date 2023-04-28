import { IsNotEmpty, IsString } from 'class-validator';

export class CityDto {
  @IsNotEmpty()
  @IsString()
  readonly city: string;

  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @IsNotEmpty()
  @IsString()
  readonly population: number;
}
