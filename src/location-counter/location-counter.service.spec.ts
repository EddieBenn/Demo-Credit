import { Test, TestingModule } from '@nestjs/testing';
import { LocationCounterService } from './location-counter.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('LocationCounterService', () => {
  let service: DeepMocked<LocationCounterService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: LocationCounterService,
          useValue: createMock<LocationCounterService>(),
        },
      ],
    }).compile();

    service = module.get(LocationCounterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
