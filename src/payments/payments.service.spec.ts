import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('PaymentsService', () => {
  let service: DeepMocked<PaymentsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PaymentsService,
          useValue: createMock<PaymentsService>(),
        },
      ],
    }).compile();

    service = module.get(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
