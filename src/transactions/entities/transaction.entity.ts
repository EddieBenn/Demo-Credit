import { v4 as uuidv4 } from 'uuid';
import { BaseEntity, StatusEnum, TypeEnum } from '../../base.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { Model } from 'objection';

export class Transaction extends BaseEntity {
  static tableName = 'transactions';

  type: TypeEnum;
  status: StatusEnum;
  description: string;
  amount: number;
  senderAccountId: string;
  senderName: string;
  receiverAccountId: string;
  receiverName: string;

  senderAccount?: Account;

  async $beforeInsert() {
    this.id = uuidv4();
    this.senderName = this.senderName.toLowerCase();
    this.receiverName = this.receiverName.toLowerCase();
  }

  static relationMappings = {
    sentTransactions: {
      relation: Model.BelongsToOneRelation,
      modelClass: Account,
      join: {
        from: 'transactions.senderAccountId',
        to: 'accounts.id',
      },
    },
  };
}
