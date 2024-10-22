import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LocationCounterModule } from '../location-counter/location-counter.module';
import { AccountsModule } from '../accounts/accounts.module';
import { FileUploadService } from '../utils/cloudinary';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register({
      dest: './users',
    }),
    forwardRef(() => LocationCounterModule),
    forwardRef(() => AccountsModule),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, FileUploadService],
})
export class UsersModule {}
