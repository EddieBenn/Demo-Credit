import { Test, TestingModule } from '@nestjs/testing';
import { LocationCounterController } from './location-counter.controller';
import { LocationCounterService } from './location-counter.service';

describe('LocationCounterController', () => {
  let controller: LocationCounterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationCounterController],
      providers: [LocationCounterService],
    }).compile();

    controller = module.get<LocationCounterController>(
      LocationCounterController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
