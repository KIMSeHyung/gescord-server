import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { generateRandomTag } from 'src/common/utils/generate-tag';
import { Repository } from 'typeorm';
import { SignUpDto } from './dto/user.dto';
import {
  FriendRequest,
  FriendRequestStatus,
} from './entity/friend-request.entity';
import { ActiveStatus, User } from './entity/user.entity';
import { UserDocument, UserForMongo } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(FriendRequest)
    private readonly friendRequest: Repository<FriendRequest>,
    @InjectModel(UserForMongo.name)
    private readonly userForMongos: Model<UserDocument>,
  ) {}

  async findById(userId: number): Promise<User> {
    const user = await this.users.findOne({ id: userId });
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.users
      .createQueryBuilder()
      .addSelect('password AS User_password')
      .where({ email })
      .getOne();
    return user;
  }

  async signUp(data: SignUpDto): Promise<User> {
    const exists = await this.users.findOne({ email: data.email });
    if (exists) {
      throw new BadRequestException('이미 존재하는 이메일입니다.');
    }

    let tag: string;
    while (true) {
      tag = generateRandomTag();
      const checkDupTag = await this.users.findOne({ name: data.name, tag });
      if (!checkDupTag) {
        break;
      }
    }

    const user = this.users.create();
    user.email = data.email;
    user.password = data.password;
    user.name = data.name;
    user.tag = tag;
    await this.users.save(user);

    // mongo insert
    await this.userForMongos.create({
      userId: user.id,
      email: user.email,
      name: user.name,
    });
    return user;
  }

  async hasRequestBeenSentOrReceived(
    creator: User,
    receiver: User,
  ): Promise<boolean> {
    const exists = await this.friendRequest.findOne({
      where: [
        { creator, receiver },
        { creator: receiver, receiver: creator },
      ],
    });
    if (exists) return true;
    return false;
  }

  async sendFriendRequest(creator: User, receiverId: number) {
    if (creator.id === receiverId) {
      throw new BadRequestException('자기 자신에게는 요청 할 수 없습니다.');
    }
    const receiver = await this.users.findOne({ id: receiverId });

    if (!receiver) {
      throw new BadRequestException('존재하지 않는 사용자 입니다');
    }
    const exists = await this.hasRequestBeenSentOrReceived(creator, receiver);
    if (exists) {
      throw new BadRequestException('친구 요청을 받았거나 신청한 상태입니다.');
    }

    const req = this.friendRequest.create();
    req.creator = creator;
    req.receiver = receiver;
    req.status = FriendRequestStatus.PENDING;
    await this.friendRequest.save(req);
  }

  async responseFriendRequest(
    friendRequestId: number,
    status: FriendRequestStatus,
  ) {
    const req = await this.friendRequest.findOne({ id: friendRequestId });
    if (req.status !== FriendRequestStatus.PENDING) {
      throw new BadRequestException('이미 처리된 요청입니다.');
    }
    await this.friendRequest.save({ ...req, status }, { transaction: true });
  }

  async getFriendRequestsFromRecipients(
    currentUser: User,
  ): Promise<FriendRequest[]> {
    return await this.friendRequest.find({
      where: [{ receiver: currentUser, status: FriendRequestStatus.PENDING }],
      relations: ['receiver', 'creator'],
    });
  }

  async getFriendRequestsStatus(currentUser: User): Promise<FriendRequest[]> {
    return await this.friendRequest.find({
      where: [{ creator: currentUser }],
      relations: ['creator', 'receiver'],
    });
  }

  async getFriends(user: User): Promise<User[]> {
    const friendRequests = await this.friendRequest.find({
      where: [
        { creator: user, status: FriendRequestStatus.ACCEPTED },
        { receiver: user, status: FriendRequestStatus.ACCEPTED },
      ],
      relations: ['creator', 'receiver'],
    });

    const friends: User[] = [];
    friendRequests.forEach((req: FriendRequest) => {
      if (user.id === req.creator.id) {
        const friend: User = req.receiver;
        friends.push(friend);
      } else if (user.id === req.receiver.id) {
        const friend: User = req.creator;
        friends.push(friend);
      }
    });

    return friends;
  }

  async findUserByNameWithTag(nameWithTag: string): Promise<User> {
    const data = nameWithTag.split('#');
    if (data.length < 2 || data[1].length < 4) {
      throw new BadRequestException('사용자명과 태그를 정확히 입력해주세요.');
    }
    const name = data[0];
    const tag = data[1];

    const user = await this.users.findOne({ name, tag });
    if (!user) {
      throw new BadRequestException('일치하는 사용자가 없습니다.');
    }

    return user;
  }

  async updateUserActiveStatus(userId: number, status: ActiveStatus) {
    await this.users.update({ id: userId }, { isActive: status });
  }
}
