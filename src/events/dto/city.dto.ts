import { IsNotEmpty, IsString } from 'class-validator';

export class CityDto {
  @IsString()
  readonly _id?: string;

  readonly city: any;

  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly country: any;

  @IsNotEmpty()
  @IsString()
  readonly population: number;

  readonly showOnHomePage: boolean;
  readonly isHidden: boolean;

  @IsString()
  readonly imagePath?: string = '';

  readonly events: any[];
}
