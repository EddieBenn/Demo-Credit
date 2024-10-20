import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LocationCounterModule } from 'src/location-counter/location-counter.module';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [LocationCounterModule, AccountsModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
