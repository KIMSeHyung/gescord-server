import { Query, Resolver } from '@nestjs/graphql';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  @Query(() => String)
  test() {
    return 'test';
  }

  @Query(() => [User])
  async getAllUser() {
    return await this.userService.getAllUser();
  }
}
