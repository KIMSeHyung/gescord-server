import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { number } from 'joi';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { Channel } from './entity/channel.entity';
import { InviteChannel } from './entity/invite-channel.entity';
import { InviteCode } from './entity/invite-code.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private readonly channels: Repository<Channel>,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(InviteCode)
    private readonly inviteCodes: Repository<InviteCode>,
    @InjectRepository(InviteChannel)
    private readonly inviteChannels: Repository<InviteChannel>,
  ) {}

  async createChannel(user: User, name: string) {
    const channel = this.channels.create();
    channel.name = name;
    channel.master = user;
    channel.participants = [user];
    await this.channels.save(channel);
  }

  async createInviteCode(user: User, channelId: number): Promise<string> {
    const channel = await this.channels.findOne(
      { id: channelId },
      { relations: ['participants'] },
    );

    const _code = await this.inviteCodes.findOne({
      channelId,
      issueUserId: user.id,
    });

    let isParticipants = false;
    channel.participants.forEach((x) => {
      if (x.id === user.id) {
        isParticipants = true;
      }
    });
    if (!isParticipants) {
      throw new BadGatewayException('채널 참가자가 아닙니다');
    }

    if (_code) {
      const curDate = new Date();
      if (curDate > _code.expiredAt) {
        _code.setData();
        await this.inviteCodes.save(_code);
      }
      return _code.code;
    }

    const code = this.inviteCodes.create();
    code.issueUserId = user.id;
    code.channelId = channelId;
    await this.inviteCodes.save(code);
    return code.code;
  }

  async joinChannelByCode(user: User, code: string): Promise<Channel> {
    const invite = await this.inviteCodes.findOne({
      select: ['channelId'],
      where: { code },
    });
    const channel = await this.channels.findOne(
      { id: invite.channelId },
      { relations: ['participants', 'master'] },
    );

    let isAlreadyJoin = false;
    channel.participants.forEach((x) => {
      if (x.id == user.id) {
        isAlreadyJoin = true;
      }
    });

    if (!isAlreadyJoin) {
      channel.participants.push(user);
      await this.channels.save(channel);
    }

    return channel;
  }

  async inviteChannelToFriend(channelId: number, user: User, toUserId: number) {
    const invite = this.inviteChannels.create();
    invite.channelId = channelId;
    invite.fromUser = user;
    invite.toUserId = toUserId;
    await this.inviteChannels.save(invite);
  }
}
