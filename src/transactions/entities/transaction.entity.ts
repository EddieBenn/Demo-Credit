import { v4 as uuidv4 } from 'uuid';
import {
  BaseEntity,
  SourceEnum,
  StatusEnum,
  TypeEnum,
} from '../../base.entity';
import { Account } from 'src/accounts/entities/account.entity';
import { Model } from 'objection';

export class Transaction extends BaseEntity {
  static tableName = 'transactions';

  type: TypeEnum;
  status: StatusEnum;
  description: string;
  source: SourceEnum;
  amount: number;
  senderAccountId?: string;
  senderName?: string;
  receiverAccountId?: string;
  receiverName?: string;

  senderAccount?: Account;
  receiverAccount?: Account;

  async $beforeInsert() {
    this.id = uuidv4();
    this.senderName = this.senderName?.toLowerCase();
    this.receiverName = this.receiverName?.toLowerCase();
  }

  static relationMappings = {
    senderAccount: {
      relation: Model.BelongsToOneRelation,
      modelClass: Account,
      join: {
        from: 'transactions.senderAccountId',
        to: 'accounts.id',
      },
    },
    receiverAccount: {
      relation: Model.BelongsToOneRelation,
      modelClass: Account,
      join: {
        from: 'transactions.receiverAccountId',
        to: 'accounts.id',
      },
    },
  };
}
