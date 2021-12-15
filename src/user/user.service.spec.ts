import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserService } from './user.service';

const mockRepository = {
  create: jest.fn(),
  findOne: jest.fn(),
};

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let usersRepository: MockRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup test', () => {
    it('존재하면 fail', () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'asdf',
        name: 'Asdf',
      });
      const ret = service.signUp({
        email: 'a',
        name: 'nameadf',
        password: 'asdf',
      });

      expect(ret).toEqual('성공');
    });
  });
});
