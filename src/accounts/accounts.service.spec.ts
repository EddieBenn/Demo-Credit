import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('AccountsService', () => {
  let service: DeepMocked<AccountsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AccountsService,
          useValue: createMock<AccountsService>(),
        },
      ],
    }).compile();

    service = module.get(AccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
