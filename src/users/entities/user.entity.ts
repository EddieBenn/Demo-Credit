import { v4 as uuidv4 } from 'uuid';
import { BaseEntity, GenderEnum, RolesEnum } from '../../base.entity';
import { Model } from 'objection';
import { Account } from '../../accounts/entities/account.entity';

export class User extends BaseEntity {
  static tableName = 'users';

  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  role: RolesEnum;
  password: string;
  gender: GenderEnum;
  city: string;
  photoUrl: string;
  otp: string;
  otpExpiry: Date;
  isVerified: boolean;
  demoId: string;

  accounts?: Account[];

  async $beforeInsert() {
    this.id = uuidv4();
    this.firstName = this.firstName.toLowerCase();
    this.lastName = this.lastName.toLowerCase();
    this.email = this.email.toLowerCase();
    this.city = this.city.toLowerCase();
  }

  static relationMappings = {
    accounts: {
      relation: Model.HasManyRelation,
      modelClass: Account,
      join: {
        from: 'users.id',
        to: 'accounts.userId',
      },
    },
  };
}
