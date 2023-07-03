import { IsNotEmpty, IsString } from 'class-validator';

export class CityDto {
  @IsString()
  readonly _id?: string;
  readonly country: any;
  readonly city: any;
  readonly description: string;
  readonly showOnHomePage: boolean;
  readonly isHidden: boolean;
  readonly imagePath?: string = '';
  readonly events: any[];
}
