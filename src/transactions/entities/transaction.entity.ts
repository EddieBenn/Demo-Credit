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
  sender_account_id: string;
  sender_name: string;
  receiver_account_id: string;
  receiver_name: string;

  senderAccount?: Account;

  async $beforeInsert() {
    this.id = uuidv4();
    this.sender_name = this.sender_name.toLowerCase();
    this.receiver_name = this.receiver_name.toLowerCase();
  }

  static relationMappings = {
    sentTransactions: {
      relation: Model.BelongsToOneRelation,
      modelClass: Account,
      join: {
        from: 'transactions.sender_account_id',
        to: 'accounts.id',
      },
    },
  };
}