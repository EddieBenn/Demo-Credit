import { Test, TestingModule } from '@nestjs/testing';
import { LocationCounterService } from './location-counter.service';

describe('LocationCounterService', () => {
  let service: LocationCounterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationCounterService],
    }).compile();

    service = module.get<LocationCounterService>(LocationCounterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
