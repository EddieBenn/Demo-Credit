import { v4 as uuidv4 } from 'uuid';
import { BaseEntity, RolesEnum } from '../../base.entity';

export class LocationCounter extends BaseEntity {
  static tableName = 'locationCounter';

  city: string;
  country: string;
  count: number;
  cityCode: string;
  role: RolesEnum;

  async $beforeInsert() {
    this.id = uuidv4();
    this.city = this.city.toLowerCase();
    this.country = this.country.toLowerCase();
    this.cityCode = this.cityCode.toUpperCase();
  }
}
