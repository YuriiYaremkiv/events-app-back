import { IsString, IsInt, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformUtils } from '../../utils/transform.values';

export enum CountrySortField {
  NAME = 'name',
}

export enum CountrySortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class RequestCountryDto {
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
  readonly query?: string;

  @IsString()
  @IsOptional()
  readonly sort?: CountrySortField;

  @IsString()
  @IsOptional()
  readonly order?: CountrySortOrder;
}
