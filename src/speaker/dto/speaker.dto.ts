import { Min, Max, IsInt, Length, IsString, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { TransformUtils } from '../../utils/transform.values';

export class SpeakerDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  readonly firstname: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 50)
  readonly lastname: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(TransformUtils.stringToNumberInt)
  readonly age: number;

  @IsNotEmpty()
  @IsString()
  @Length(6, 200)
  readonly about: string;

  @IsNotEmpty()
  @IsString()
  @Length(4, 50)
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 200)
  readonly topic: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 200)
  readonly telephone: string;
}
