import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelResolver } from './channel.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entity/channel.entity';
import { User } from 'src/user/entity/user.entity';
import { InviteCode } from './entity/invite-code.entity';
import { InviteChannel } from './entity/invite-channel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Channel, User, InviteCode, InviteChannel]),
  ],
  providers: [ChannelService, ChannelResolver],
  exports: [ChannelService],
})
export class ChannelModule {}
