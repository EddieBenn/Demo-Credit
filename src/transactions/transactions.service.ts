import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CreateTransactionDto,
  TransactionFilter,
} from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ModelClass } from 'objection';
import { Transaction } from './entities/transaction.entity';
import { myTransaction } from '../utils/transaction';
import { buildTransactionFilter } from '../filters/query-filter';
import { AccountRoleEnum, IReqUser, StatusEnum } from '../base.entity';
import { PaginationResponseDto } from './dto/paginate.dto';
import { User } from '../users/entities/user.entity';
import { Account } from '../accounts/entities/account.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('Transaction')
    private readonly transactionModel: ModelClass<Transaction>,
    @Inject('User')
    private readonly userModel: ModelClass<User>,
    @Inject('Account')
    private readonly accountModel: ModelClass<Account>,
  ) {}

  async createTransaction(
    data: CreateTransactionDto,
  ): Promise<CreateTransactionDto> {
    return myTransaction(this.transactionModel, async (trx) => {
      return this.transactionModel.query(trx).insert(data);
    });
  }

  async getAllTransactions(queryParams: TransactionFilter) {
    const page = queryParams?.page ? Number(queryParams?.page) : 1;
    const size = queryParams?.size ? Number(queryParams.size) : 10;
    const query = await buildTransactionFilter(queryParams);

    const result = await this.transactionModel
      .query()
      .where(query)
      .orderBy('createdAt', 'DESC')
      .page(page - 1, size);

    const totalPages = Math.ceil(result.total / size);

    return {
      transactions: result.results,
      pagination: {
        totalRows: result.total,
        perPage: size,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async getTransactionById(id: string): Promise<CreateTransactionDto> {
    const transaction = await this.transactionModel.query().findById(id);
    if (!transaction?.id) {
      throw new HttpException(
        `transaction with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return transaction;
  }

  async getTransactionsByAccountId(
    accountId: string,
    queryParams?: TransactionFilter,
  ): Promise<PaginationResponseDto> {
    const page = queryParams?.page ? Number(queryParams?.page) : 1;
    const size = queryParams?.size ? Number(queryParams.size) : 10;

    const result = await this.transactionModel
      .query()
      .where('senderAccountId', accountId)
      .orWhere('receiverAccountId', accountId)
      .orderBy('createdAt', 'DESC')
      .page(page - 1, size);

    if (!result || result.total === 0) {
      throw new HttpException(
        `no transactions found this user with accountId: ${accountId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    const totalPages = Math.ceil(result.total / size);

    return {
      transactions: result.results,
      pagination: {
        totalRows: result.total,
        perPage: size,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async updateTransactionById(id: string, data: UpdateTransactionDto) {
    return myTransaction(this.transactionModel, async (trx) => {
      const updatedTransaction = await this.transactionModel
        .query(trx)
        .update(data)
        .where('id', id)
        .returning('*')
        .first();

      if (!updatedTransaction) {
        throw new HttpException(
          `Transaction with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedTransaction;
    });
  }

  async deleteTransactionById(id: string, user: IReqUser) {
    const transaction = await this.transactionModel.query().findById(id);

    if (!transaction) {
      throw new HttpException(
        `Transaction with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    const accountId = transaction?.senderAccountId
      ? transaction.senderAccountId
      : transaction.receiverAccountId;

    if (!accountId) {
      throw new HttpException(
        `No account ID found for this transaction`,
        HttpStatus.NOT_FOUND,
      );
    }
    const account = await this.accountModel.query().findOne({ id: accountId });

    if (user?.role !== 'admin' && user?.id !== account?.userId) {
      throw new HttpException(
        "Unauthorized: You cannot delete another user's transaction",
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.transactionModel.query().deleteById(id);
  }

  async updateTransactionStatus(
    email: string,
    amount: number,
    status: StatusEnum,
    accountRole: AccountRoleEnum,
  ) {
    const user = await this.userModel.query().findOne({ email });

    if (!user?.id) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const account = await this.accountModel
      .query()
      .findOne({ userId: user.id });

    if (!account?.id) {
      throw new HttpException(
        'User does not have an account',
        HttpStatus.NOT_FOUND,
      );
    }

    const accountKey =
      accountRole === AccountRoleEnum.SENDER
        ? 'senderAccountId'
        : 'receiverAccountId';

    const transaction = await this.transactionModel.query().findOne({
      [accountKey]: account.id,
      amount,
      status: StatusEnum.PENDING,
    });

    if (!transaction) {
      throw new HttpException('No pending transaction', HttpStatus.NOT_FOUND);
    }
    await this.transactionModel.query().findById(transaction.id).patch({
      status,
    });
  }
}
