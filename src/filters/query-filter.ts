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

  if (queryParams?.startDate && queryParams?.endDate) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(queryParams?.startDate)) {
      throw new HttpException(
        `use date format yy-mm-dd`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    query['createdAt'] = {
      between: [new Date(queryParams.startDate), new Date(queryParams.endDate)],
    };
  }
  return query;
};

export const buildAccountFilter = async (queryParams: AccountFilter) => {
  const query = {};
  if (queryParams?.accountName)
    query['accountName'] = queryParams.accountName.toLowerCase();
  if (queryParams?.accountNumber)
    query['accountNumber'] = queryParams.accountNumber;
  if (queryParams?.bankName)
    query['bankName'] = queryParams.bankName.toLowerCase();
  if (queryParams?.userId) query['userId'] = queryParams.userId;

  if (queryParams?.startDate && queryParams?.endDate) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(queryParams?.startDate)) {
      throw new HttpException(
        `use date format yy-mm-dd`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    query['createdAt'] = {
      between: [new Date(queryParams.startDate), new Date(queryParams.endDate)],
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
  if (queryParams?.senderAccountId)
    query['senderAccountId'] = queryParams.senderAccountId;
  if (queryParams?.senderName)
    query['senderName'] = queryParams.senderName.toLowerCase();
  if (queryParams?.receiverAccountId)
    query['receiverAccountId'] = queryParams.receiverAccountId;
  if (queryParams?.receiverName)
    query['receiverName'] = queryParams.receiverName.toLowerCase();

  if (queryParams?.startDate && queryParams?.endDate) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(queryParams?.startDate)) {
      throw new HttpException(
        `use date format yy-mm-dd`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    query['createdAt'] = {
      between: [new Date(queryParams.startDate), new Date(queryParams.endDate)],
    };
  }
  return query;
};

export const buildUserFilter = async (queryParams: UserFilter) => {
  const query = {};

  if (queryParams?.firstName)
    query['firstName'] = queryParams.firstName.toLowerCase();
  if (queryParams?.lastName)
    query['lastName'] = queryParams.lastName.toLowerCase();
  if (queryParams?.email) query['email'] = queryParams.email.toLowerCase();
  if (queryParams?.phoneNumber) query['phoneNumber'] = queryParams.phoneNumber;
  if (queryParams?.gender) query['gender'] = queryParams.gender.toLowerCase();
  if (queryParams?.city) query['city'] = queryParams.city.toLowerCase();
  if (queryParams?.role) query['role'] = queryParams.role.toLowerCase();
  if (queryParams?.demoId) query['demoId'] = queryParams.demoId.toUpperCase();

  if (queryParams?.startDate && queryParams?.endDate) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(queryParams?.startDate)) {
      throw new HttpException(
        `use date format yy-mm-dd`,
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    query['createdAt'] = {
      between: [new Date(queryParams.startDate), new Date(queryParams.endDate)],
    };
  }
  return query;
};
