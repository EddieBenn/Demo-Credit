import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('TransactionsService', () => {
  let service: DeepMocked<TransactionsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: TransactionsService,
          useValue: createMock<TransactionsService>(),
        },
      ],
    }).compile();

    service = module.get(TransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
