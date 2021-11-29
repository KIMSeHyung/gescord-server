import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    const user = await this.users.findOne({ email });
    return user;
  }

  async signUp(data: SignUpDto): Promise<User> {
    const exists = await this.users.findOne({ email: data.email });
    if (exists) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }
    const user = this.users.create();
    user.email = data.email;
    user.password = data.password;
    user.name = data.name;
    await this.users.save(user);
    return user;
  }

  async getAllUser(): Promise<User[]> {
    const users = await this.users.find();
    return users;
  }
}
