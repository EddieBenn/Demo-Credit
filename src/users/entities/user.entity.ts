import { v4 as uuidv4 } from 'uuid';
import { BaseEntity, GenderEnum, RolesEnum } from '../../base.entity';
import { Model } from 'objection';
import { Account } from 'src/accounts/entities/account.entity';

export class User extends BaseEntity {
  static tableName = 'users';

  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  role: RolesEnum;
  password: string;
  gender: GenderEnum;
  city: string;
  photo_url: string;
  otp: number;
  otp_expiry: Date;
  is_verified: boolean;
  demo_id: string;

  async $beforeInsert() {
    this.id = uuidv4();
    this.first_name = this.first_name.toLowerCase();
    this.last_name = this.last_name.toLowerCase();
    this.email = this.email.toLowerCase();
    this.city = this.city.toLowerCase();
  }

  static relationMappings = {
    accounts: {
      relation: Model.HasManyRelation,
      modelClass: Account,
      join: {
        from: 'users.id',
        to: 'accounts.user_id',
      },
    },
  };
}
