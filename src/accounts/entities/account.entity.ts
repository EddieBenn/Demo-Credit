import { v4 as uuidv4 } from 'uuid';
import { BaseEntity } from '../../base.entity';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { Model } from 'objection';

export class Account extends BaseEntity {
  static tableName = 'accounts';

  account_name: string;
  account_number: string;
  account_balance: number;
  bank_name: string;
  user_id: string;

  async $beforeInsert() {
    this.id = uuidv4();
    this.account_name = this.account_name.toLowerCase();
    this.bank_name = this.bank_name.toLowerCase();
  }

  static relationMappings = {
    senderAccount: {
      relation: Model.HasManyRelation,
      modelClass: Transaction,
      join: {
        from: 'accounts.id',
        to: 'transactions.sender_account_id',
      },
    },
  };
}