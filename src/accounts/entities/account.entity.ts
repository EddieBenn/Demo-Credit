import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '../../base.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Model } from 'objection';
import { User } from 'src/users/entities/user.entity';

export class Account extends BaseEntity {
  static tableName = 'accounts';

  accountName: string;
  accountNumber: string;
  accountBalance: number;
  bankName: string;
  userId: string;

  async $beforeInsert() {
    this.id = uuidv4();
    this.accountName = this.accountName.toLowerCase();
    this.bankName = this.bankName.toLowerCase();
  }

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'accounts.userId',
        to: 'users.id',
      },
    },
    senderAccount: {
      relation: Model.HasManyRelation,
      modelClass: Transaction,
      join: {
        from: 'accounts.id',
        to: 'transactions.senderAccountId',
      },
    },
    receiverAccount: {
      relation: Model.HasManyRelation,
      modelClass: Transaction,
      join: {
        from: 'accounts.id',
        to: 'transactions.receiverAccountId',
      },
    },
  };
}
