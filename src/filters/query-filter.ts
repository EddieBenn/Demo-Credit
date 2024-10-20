import { HttpException, HttpStatus } from '@nestjs/common';
import { AccountFilter } from 'src/accounts/dto/create-account.dto';
import { LocationCounterFilter } from 'src/location-counter/dto/create-location-counter.dto';
import { TransactionFilter } from 'src/transactions/dto/create-transaction.dto';
import { UserFilter } from 'src/users/dto/create-user.dto';

export const buildLocationCounterFilter = async (
  queryParams: LocationCounterFilter,
) => {
  const query = {};
  if (queryParams?.city) query['city'] = queryParams.city.toLowerCase();
  if (queryParams?.role) query['role'] = queryParams.role.toLowerCase();

  if (queryParams?.start_date && queryParams?.end_date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(queryParams?.start_date)) {
      throw new HttpException(
        `use date format yy-mm-dd`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    query['created_at'] = {
      between: [
        new Date(queryParams.start_date),
        new Date(queryParams.end_date),
      ],
    };
  }
  return query;
};

export const buildAccountFilter = async (queryParams: AccountFilter) => {
  const query = {};
  if (queryParams?.account_name)
    query['account_name'] = queryParams.account_name.toLowerCase();
  if (queryParams?.account_number)
    query['account_number'] = queryParams.account_number;
  if (queryParams?.bank_name)
    query['bank_name'] = queryParams.bank_name.toLowerCase();
  if (queryParams?.user_id) query['user_id'] = queryParams.user_id;

  if (queryParams?.start_date && queryParams?.end_date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(queryParams?.start_date)) {
      throw new HttpException(
        `use date format yy-mm-dd`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    query['created_at'] = {
      between: [
        new Date(queryParams.start_date),
        new Date(queryParams.end_date),
      ],
    };
  }
  return query;
};

export const buildTransactionFilter = async (
  queryParams: TransactionFilter,
) => {
  const query = {};
  if (queryParams?.type) query['type'] = queryParams.type.toLowerCase();
  if (queryParams?.status) query['status'] = queryParams.status.toLowerCase();
  if (queryParams?.amount) query['amount'] = queryParams.amount;
  if (queryParams?.sender_account_id)
    query['sender_account_id'] = queryParams.sender_account_id;
  if (queryParams?.sender_name)
    query['sender_name'] = queryParams.sender_name.toLowerCase();
  if (queryParams?.receiver_account_id)
    query['receiver_account_id'] = queryParams.receiver_account_id;
  if (queryParams?.receiver_name)
    query['receiver_name'] = queryParams.receiver_name.toLowerCase();

  if (queryParams?.start_date && queryParams?.end_date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(queryParams?.start_date)) {
      throw new HttpException(
        `use date format yy-mm-dd`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    query['created_at'] = {
      between: [
        new Date(queryParams.start_date),
        new Date(queryParams.end_date),
      ],
    };
  }
  return query;
};

export const buildUserFilter = async (queryParams: UserFilter) => {
  const query = {};

  if (queryParams?.first_name)
    query['first_name'] = queryParams.first_name.toLowerCase();
  if (queryParams?.last_name)
    query['last_name'] = queryParams.last_name.toLowerCase();
  if (queryParams?.email) query['email'] = queryParams.email.toLowerCase();
  if (queryParams?.phone_number)
    query['phone_number'] = queryParams.phone_number;
  if (queryParams?.gender) query['gender'] = queryParams.gender.toLowerCase();
  if (queryParams?.city) query['city'] = queryParams.city.toLowerCase();
  if (queryParams?.role) query['role'] = queryParams.role.toLowerCase();
  if (queryParams?.demo_id)
    query['demo_id'] = queryParams.demo_id.toUpperCase();

  if (queryParams?.start_date && queryParams?.end_date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(queryParams?.start_date)) {
      throw new HttpException(
        `use date format yy-mm-dd`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    query['created_at'] = {
      between: [
        new Date(queryParams.start_date),
        new Date(queryParams.end_date),
      ],
    };
  }
  return query;
};
