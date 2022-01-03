import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { Strategy } from 'passport-jwt';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { JWT_SECRET } from './auth.constants';

const fromAuthCookie = function () {
  return function (req: any) {
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
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: fromAuthCookie(),
      ignoreExpiration: false,
      secretOrKey: configService.get(JWT_SECRET),
    });
  }

  async validate(payload: any): Promise<User> {
    // get cache
    const cached: User = await this.cacheManager.get(`user-${payload.id}`);
    if (cached) {
      return cached;
    }
    const user = await this.userService.findById(payload.id);
    if (!user) {
      throw new UnauthorizedException('인증되지 않았습니다.');
    }
    // set cache
    await this.cacheManager.set(`user-${payload.id}`, user, { ttl: 600 });
    return user;
  }
}
