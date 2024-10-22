import { forwardRef, Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { UsersModule } from 'src/users/users.module';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(() => AccountsModule)],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
