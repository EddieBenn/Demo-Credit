import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AccountFilter, CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';
import { ModelClass } from 'objection';
import { myTransaction } from 'src/utils/transaction';
import { buildAccountFilter } from 'src/filters/query-filter';
import { IReqUser } from 'src/base.entity';

@Injectable()
export class AccountsService {
  constructor(
    @Inject('Account')
    private readonly accountModel: ModelClass<Account>,
  ) {}

  async createAccount(data: CreateAccountDto): Promise<CreateAccountDto> {
    return myTransaction(this.accountModel, async (trx) => {
      return this.accountModel.query(trx).insert(data);
    });
  }

  async getAllAccounts(queryParams: AccountFilter) {
    const page = queryParams?.page ? Number(queryParams?.page) : 1;
    const size = queryParams?.size ? Number(queryParams.size) : 10;
    const query = await buildAccountFilter(queryParams);

    const result = await this.accountModel
      .query()
      .where(query)
      .orderBy('createdAt', 'DESC')
      .page(page - 1, size);

    const totalPages = Math.ceil(result.total / size);

    return {
      accounts: result.results,
      pagination: {
        totalRows: result.total,
        perPage: size,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async getAccountById(id: string): Promise<CreateAccountDto> {
    const account = await this.accountModel.query().findById(id);
    if (!account?.id) {
      throw new HttpException(
        `account with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return account;
  }

  async getAccountByUserId(userId: string): Promise<CreateAccountDto> {
    const userAccount = await this.accountModel
      .query()
      .where('userId', userId)
      .first();

    if (!userAccount?.id) {
      throw new HttpException(
        `account with user_id: ${userId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return userAccount;
  }

  async updateAccountById(id: string, data: UpdateAccountDto) {
    return myTransaction(this.accountModel, async (trx) => {
      const updatedAccount = await this.accountModel
        .query(trx)
        .update(data)
        .where('id', id)
        .returning('*')
        .first();

      if (!updatedAccount) {
        throw new HttpException(
          `Account with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedAccount;
    });
  }

  async deleteAccountById(id: string, user: IReqUser) {
    const account = await this.accountModel.query().findById(id);

    if (!account) {
      throw new HttpException(
        `Account with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.role !== 'admin' && user.id !== account.userId) {
      throw new HttpException(
        "Unauthorized: You cannot delete another user's account",
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.accountModel.query().deleteById(id);
  }

  async deleteAccountByUserId(userId: string) {
    return await this.accountModel.query().delete().where('userId', userId);
  }
}
