import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(createUserDto: CreateUserDto): Promise<any> {
    const { usernameTaken, emailTaken } =
      await this.usersService.isEmailOrUsernameTaken(
        createUserDto.username,
        createUserDto.email,
      );

    if (usernameTaken) throw new BadRequestException('Username already exists');
    if (emailTaken) throw new BadRequestException('Email already exists');

    const hashPassword = await this.hashPassword(createUserDto.password);
    const newUser = await this.usersService.create({
      ...createUserDto,
      password: hashPassword,
    });

    const tokens = await this.getTokens(newUser._id, newUser.username);
    await this.updateRefreshToken(newUser._id, tokens.refreshToken);
    return tokens;
  }

  async signin(authDto: AuthDto) {
    const user = await this.usersService.findByEmail(authDto.email);

    if (!user) throw new BadRequestException('User does not exist');

    const passwordMatches = await this.hashPasswordVerify(
      authDto.password,
      user.password,
    );

    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    const tokens = await this.getTokens(user._id, user.username);
    await this.updateRefreshToken(user._id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    const updatedUser = await this.usersService.update(userId, {
      refreshToken: null,
    });
    return updatedUser;
  }

  async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 5);
    return hashedPassword;
  }

  async hashPasswordVerify(
    authRequestPassword: string,
    userDbPassword: string,
  ): Promise<boolean> {
    const passwordMatches = await bcrypt.compare(
      authRequestPassword,
      userDbPassword,
    );
    return passwordMatches;
  }

  async hashData(data: string): Promise<string> {
    const hashData = await bcrypt.hash(data, 3);
    return hashData;
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);

    await this.usersService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(userId: string, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { id: userId, username },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '30m',
        },
      ),
      this.jwtService.signAsync(
        { id: userId, username },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '30d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denies');

    const tokens = await this.getTokens(user._id, user.username);
    await this.updateRefreshToken(user._id, tokens.refreshToken);
    return tokens;
  }
}
