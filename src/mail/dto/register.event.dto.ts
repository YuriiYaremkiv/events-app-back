import {
  Length,
  IsEmail,
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class RegisterEventDto {
  @IsNotEmpty()
  @IsString()
  @Length(2, 6)
  readonly name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;

  @IsOptional()
  @IsString()
  @Length(6, 200)
  readonly message: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 75)
  readonly cityName: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 50)
  readonly eventName: string;
}
