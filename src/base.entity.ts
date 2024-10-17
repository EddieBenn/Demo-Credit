export enum RolesEnum {
  USER = 'user',
  ADMIN = 'admin',
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
