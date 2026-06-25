import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService,
    @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  ) {}


 
private async updateRefreshToken(
  userId: number,
  refreshToken: string,
) {
  const hash = await bcrypt.hash(
    refreshToken,
    10,
  );

  await this.userRepository.update(
    { userId },
    {
      refreshTokenHash: hash,
    },
  );
}


async login(username: string, password: string) {
  const user = await this.userRepository.findOne({
    where: { email: username },
  });

  if (!user) {
    throw new UnauthorizedException('user not found');
  }

  if (user.passwordHash != password) {
    throw new UnauthorizedException('invalid credentials');
  }

  const payload = {
  sub: user.userId,
  email: user.email,
  roleId: user.roleId,
};

  const accessToken = await this.jwtService.signAsync(
    payload,
    {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    },
  );

  const refreshToken = await this.jwtService.signAsync(
    payload,
    {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    },
  );

  await this.updateRefreshToken(
  user.userId,
  refreshToken,
);

  return {
    accessToken,
    refreshToken,
  };
}

async refreshToken(refreshToken: string) {
  const payload = await this.jwtService.verifyAsync(
    refreshToken,
    {
      secret: process.env.JWT_REFRESH_SECRET,
    },
  );

 const user = await this.userRepository.findOne({
  where: {
    userId: payload.sub,
  },
});



  if (!user ) {
    throw new UnauthorizedException('user not found');
  }

  if (!user.refreshTokenHash) {
    throw new UnauthorizedException('refresh token not found');
  }

  const valid = await bcrypt.compare(
    refreshToken,
    user.refreshTokenHash,
  );

  if (!valid) {
    throw new UnauthorizedException();
  }

  const accessToken = await this.jwtService.signAsync(
    {
      sub: user.userId,
      email: user.email,
    },
    {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    },
  );

const newRefreshToken = await this.jwtService.signAsync(
  {
    sub: user.userId,
    email: user.email,
    roleId: user.roleId,
  },
  {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
  },
);

await this.updateRefreshToken(
  user.userId,
  newRefreshToken,
);


  return {
      accessToken,
  refreshToken: newRefreshToken,
  };
}

}
