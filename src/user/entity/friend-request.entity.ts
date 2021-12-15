import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BaseComlum } from 'src/common/entity/base.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

export type FriendRequestStatusType = 'pending' | 'accepted' | 'declined';

export enum FriendRequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLIEND = 'declined',
}

registerEnumType(FriendRequestStatus, {
  name: 'FriendRequestStatus',
  description: 'friend request status',
});

@ObjectType()
@Entity()
export class FriendRequest extends BaseComlum {
  @Field(() => User)
  @ManyToOne(() => User, (u) => u.sentFriendRequest)
  creator: User;

  @Field(() => User)
  @ManyToOne(() => User, (u) => u.recivedFriendRequest)
  receiver: User;

  @Field(() => FriendRequestStatus)
  @Column({
    type: 'enum',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  status: FriendRequestStatus;
}
