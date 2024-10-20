import { Model } from 'objection';

export class BaseEntity extends Model {
  static get idColumn() {
    return 'id';
  }

  static get timestamps() {
    return true;
  }

  id?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  deletedAt?: Date | string | null;
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
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  role: string;
  photoUrl: string;
  demoId: string;
  isVerified: boolean;
}
