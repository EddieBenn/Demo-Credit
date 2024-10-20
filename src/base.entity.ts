import { Model } from 'objection';

export class BaseEntity extends Model {
  static get idColumn() {
    return 'id';
  }

  static get timestamps() {
    return true;
  }

  id?: string;
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string | null;
}

export enum RolesEnum {
  USER = 'user',
  ADMIN = 'admin',
}

export enum ADMIN_ROLES {
  ADMIN = 'admin',
}

export enum TypeEnum {
  CREDIT = 'credit',
  DEBIT = 'debit',
}

export enum StatusEnum {
  PENDING = 'pending',
  SUCCESSFUL = 'successful',
  FAILED = 'failed',
}

export enum GenderEnum {
  MALE = 'male',
  FEMALE = 'female',
}

export interface IPagination {
  totalRows: number;
  perPage: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface IReqUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  city: string;
  role: string;
  demo_id?: string;
}
