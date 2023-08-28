import { IsInt, Min, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformUtils } from '../../utils/transform.values';

export class RequestSpeakerDto {
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
}
