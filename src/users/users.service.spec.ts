import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('UsersService', () => {
  let service: DeepMocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: createMock<UsersService>(),
        },
      ],
    }).compile();

    service = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
