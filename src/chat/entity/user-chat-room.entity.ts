import { ObjectType } from '@nestjs/graphql';
import { BaseComlum } from 'src/common/entity/base.entity';
import { Entity } from 'typeorm';

@ObjectType({ description: '유저간 채팅룸' })
@Entity()
export class UserChatRoom extends BaseComlum {}
