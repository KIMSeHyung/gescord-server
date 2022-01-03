import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entity/user.entity';
import { Repository } from 'typeorm';
import { Channel } from './entity/channel.entity';
import {
  InviteChannel,
  InviteChannelStatus,
} from './entity/invite-channel.entity';
import { InviteCode } from './entity/invite-code.entity';

@Injectable()
export class ChannelService {
  constructor(
    @InjectRepository(Channel) private readonly channels: Repository<Channel>,
    @InjectRepository(InviteCode)
    private readonly inviteCodes: Repository<InviteCode>,
    @InjectRepository(InviteChannel)
    private readonly inviteChannels: Repository<InviteChannel>,
  ) {}

  isParticipants(userId: number, participants: User[]) {
    for (let i = 0; i < participants.length; i++) {
      if (participants[i].id === userId) {
        return;
      }
    }
    throw new BadGatewayException('채널 참가자가 아닙니다');
  }

  async getChannelInfo(user: User, channelId: number) {
    const channel = await this.channels.findOne(
      { id: channelId },
      { relations: ['participants', 'master', 'chatRoom'] },
    );
    this.isParticipants(user.id, channel.participants);

    return channel;
  }

  async createChannel(user: User, name: string) {
    const channel = this.channels.create();
    channel.name = name;
    channel.master = user;
    channel.participants = [user];
    return await this.channels.save(channel);
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

    this.isParticipants(user.id, channel.participants);

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
    if (!invite) {
      throw new BadRequestException('존재하지 않는 코드입니다.');
    }
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

  async inviteChannelToFriend(
    channelId: number,
    user: User,
    toUserId: number,
    roomId?: number,
  ) {
    const invite = this.inviteChannels.create();
    invite.channelId = channelId;
    invite.fromUser = user;
    invite.toUserId = toUserId;
    invite.roomId = roomId;
    await this.inviteChannels.save(invite);
  }

  async joinChannel(inviteChannelId: number, user: User) {
    const inviteChannel = await this.inviteChannels.findOne(
      {
        id: inviteChannelId,
        toUser: user,
      },
      { relations: ['channel', 'channel.participants'] },
    );

    if (!inviteChannel.channel) {
      throw new BadGatewayException('존재하지 않는 채널입니다.');
    }

    let isAlreadyJoin = false;
    inviteChannel.channel.participants.forEach((x) => {
      if (x.id == user.id) {
        isAlreadyJoin = true;
      }
    });

    if (!isAlreadyJoin) {
      inviteChannel.channel.participants.push(user);
      await this.channels.save(inviteChannel.channel);
    }

    inviteChannel.status = InviteChannelStatus.ACCEPTED;
    await this.inviteChannels.save(inviteChannel);
  }

  async awayChannel(user: User, channelId: number) {
    const ret = await this.channels
      .createQueryBuilder()
      .delete()
      .from('channel_participants_user')
      .where('channelId = :channelId', { channelId })
      .andWhere('userId = :userId', { userId: user.id })
      .execute();
    if (!ret.affected) {
      throw new BadGatewayException('채널 참가자가 아닙니다');
    }
  }
}
