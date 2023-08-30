import { IsBoolean, IsString, IsInt, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformUtils } from '../../utils/transform.values';

export enum CitySortField {
  NAME = 'name',
  RATING = 'rating',
  PRIORITY = 'priority',
}

export enum CitySortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class RequestCityDto {
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(TransformUtils.stringToNumberInt)
  readonly page?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(TransformUtils.stringToNumberInt)
  readonly limit?: number;

  @IsString()
  @IsOptional()
  readonly cities?: string;

  @IsString()
  @IsOptional()
  readonly countries?: string;

  @IsString()
  @IsOptional()
  readonly query?: string;

  @IsString()
  @IsOptional()
  readonly sort?: CitySortField;

  @IsString()
  @IsOptional()
  readonly order?: CitySortOrder;

  @IsBoolean()
  @IsOptional()
  @Transform(TransformUtils.stringToBoolean)
  readonly showOnHomePage?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(TransformUtils.stringToBoolean)
  readonly showInCityHome?: boolean;

  @IsBoolean()
  @IsOptional()
  @Transform(TransformUtils.stringToBoolean)
  readonly isHidden?: boolean;
}
