import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signup(createUserDto);
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    return { accessToken: tokens.accessToken };
  }

  @Post('signin')
  async signin(
    @Body() authDto: AuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.signin(authDto);
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    return { accessToken: tokens.accessToken };
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    res.cookie('refreshToken', null, { httpOnly: true });
    this.authService.logout(req.user['id']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userId = req.user['id'];
    const refreshToken = req.cookies['refreshToken'];
    const tokens = await this.authService.refreshTokens(userId, refreshToken);
    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true });
    return { accessToken: tokens.accessToken };
  }
}
