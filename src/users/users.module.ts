import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LocationCounterModule } from 'src/location-counter/location-counter.module';
import { AccountsModule } from 'src/accounts/accounts.module';
import { FileUploadService } from 'src/utils/cloudinary';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [LocationCounterModule, AccountsModule, AuthModule],
  controllers: [UsersController],
  providers: [UsersService, FileUploadService],
})
export class UsersModule {}
