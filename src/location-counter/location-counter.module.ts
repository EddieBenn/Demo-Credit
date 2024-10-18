import { Module } from '@nestjs/common';
import { LocationCounterService } from './location-counter.service';
import { LocationCounterController } from './location-counter.controller';

@Module({
  controllers: [LocationCounterController],
  providers: [LocationCounterService],
  exports: [LocationCounterService],
})
export class LocationCounterModule {}
