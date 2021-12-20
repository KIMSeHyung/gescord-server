import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { JWT_SECRET } from './auth.constants';

const fromAuthCookie = function () {
  return function (req: Request) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['Authorization'];
    }
    return token;
  };
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: fromAuthCookie(),
      ignoreExpiration: false,
      secretOrKey: configService.get(JWT_SECRET),
    });
  }

  async validate(payload: any): Promise<User> {
    const user = await this.userService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException('인증되지 않았습니다.');
    }
    return user;
  }
}
