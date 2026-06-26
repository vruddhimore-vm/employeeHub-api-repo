import { Controller, Post, Body, Res, Req, BadRequestException } from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import type { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto,@Res({ passthrough: true }) res: Response,) {
   const result =  await this.authService.login(
      body.email,
      body.password,
    );

  const accessToken = result.accessToken;
  const refreshToken = result.refreshToken;

  res.cookie('refresh_token', refreshToken, {
     httpOnly: true,
  secure: false,      // localhost
  sameSite: 'lax',    // <-- change this
  path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return {
    accessToken,
  };
  }

  @Post('refresh')
  async refresh(@Req() req: Request,
  @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token ?? req.body?.refreshToken;
     console.log("-----",req.cookies);

    if (!refreshToken) {
      throw new BadRequestException('Refresh token is missing');
    }

    const result = await this.authService.refreshToken(refreshToken);

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
    };
  }
}

// @Post('logout')
// logout(
//   @Res({ passthrough: true }) res: Response,
// ) {
//   res.clearCookie('refresh_token', {
//     path: '/auth/refresh',
//   });

//   return {
//     message: 'Logged out',
//   };
// }