import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { FriendRequest } from './entity/friend-request.entity';
import { Channel } from 'src/channel/entity/channel.entity';
import { InviteCode } from 'src/channel/entity/invite-code.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UserForMongo, UserForMongoSchema } from './schema/user.schema';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([User, FriendRequest, Channel, InviteCode]),
    MongooseModule.forFeature([
      { name: UserForMongo.name, schema: UserForMongoSchema },
    ]),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
