import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { compare } from 'bcrypt';
import { ActiveStatus, User } from 'src/user/entity/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    const isValid = await compare(password, user.password);
    if (user && isValid) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      tag: user.tag,
    };
    await this.userService.updateUserActiveStatus(user.id, ActiveStatus.ON);
    return this.jwtService.sign(payload);
  }
}
