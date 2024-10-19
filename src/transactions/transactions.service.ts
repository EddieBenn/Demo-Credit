import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import {
  CreateTransactionDto,
  TransactionFilter,
} from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { ModelClass } from 'objection';
import { Transaction } from './entities/transaction.entity';
import { myTransaction } from 'src/utils/transaction';
import { buildTransactionFilter } from 'src/filters/query-filter';
import { IReqUser } from 'src/base.entity';
import { PaginationResponseDto } from './dto/paginate.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @Inject('Transaction')
    private readonly transactionModel: ModelClass<Transaction>,
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
      .orderBy('created_at', 'DESC')
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

  async getTransactionsBySenderId(
    sender_account_id: string,
    queryParams?: TransactionFilter,
  ): Promise<PaginationResponseDto> {
    const page = queryParams?.page ? Number(queryParams?.page) : 1;
    const size = queryParams?.size ? Number(queryParams.size) : 10;

    const result = await this.transactionModel
      .query()
      .where('sender_account_id', sender_account_id)
      .orderBy('created_at', 'DESC')
      .page(page - 1, size);

    if (!result || result.total === 0) {
      throw new HttpException(
        `no transactions found this user with account_id: ${sender_account_id}`,
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

  async getTransactionsByReceiverId(
    receiver_account_id: string,
    queryParams?: TransactionFilter,
  ): Promise<PaginationResponseDto> {
    const page = queryParams?.page ? Number(queryParams?.page) : 1;
    const size = queryParams?.size ? Number(queryParams.size) : 10;

    const result = await this.transactionModel
      .query()
      .where('receiver_account_id', receiver_account_id)
      .orderBy('created_at', 'DESC')
      .page(page - 1, size);

    if (!result || result.total === 0) {
      throw new HttpException(
        `user with account_id: ${receiver_account_id} has not received any money`,
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
    const transaction = await this.transactionModel
      .query()
      .findById(id)
      .withGraphFetched('senderAccount');

    if (!transaction) {
      throw new HttpException(
        `Transaction with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!transaction.senderAccount) {
      throw new HttpException(
        `Sender account for this transaction not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      user.role !== 'admin' &&
      user.id !== transaction.senderAccount.user_id
    ) {
      throw new HttpException(
        "Unauthorized: You cannot delete another user's transaction",
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.transactionModel.query().deleteById(id);
  }
}
