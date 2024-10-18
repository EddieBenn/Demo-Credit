import { v4 as uuidv4 } from 'uuid';
import { BaseEntity, RolesEnum } from '../../base.entity';

export class LocationCounter extends BaseEntity {
  static tableName = 'location_counter';

  city: string;
  country: string;
  count: number;
  city_code: string;
  role: RolesEnum;

  async $beforeInsert() {
    this.id = uuidv4();
    this.city = this.city.toLowerCase();
    this.country = this.country.toLowerCase();
    this.city_code = this.city_code.toUpperCase();
  }
}
