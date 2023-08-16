import { IsBoolean, IsString, IsInt, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformUtils } from '../../utils/transform.values';

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
