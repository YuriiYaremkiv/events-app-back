import { IsEmail, IsString, Length, IsNotEmpty } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsNotEmpty()
  @IsString({ message: 'Must be a string' })
  @Length(6, 20, { message: 'Min length 6, max 20' })
  password: string;
}
