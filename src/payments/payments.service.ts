import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { AccountsService } from 'src/accounts/accounts.service';
import {
  AccountRoleEnum,
  SourceEnum,
  StatusEnum,
  TypeEnum,
} from 'src/base.entity';
import { ModelClass } from 'objection';
import { Transaction } from 'src/transactions/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Account } from 'src/accounts/entities/account.entity';

@Injectable()
export class PaymentsService {
  private readonly secretKey: string;

  constructor(
    @Inject('Transaction')
    private readonly transactionModel: ModelClass<Transaction>,
    @Inject('Account')
    private readonly accountModel: ModelClass<Account>,
    @Inject('User')
    private readonly userModel: ModelClass<User>,
    private readonly configService: ConfigService,
    private readonly accountsService: AccountsService,
    private readonly transactionsService: TransactionsService,
  ) {
    this.secretKey = this.configService.get<string>('PAYSTACK_SECRET_KEY');
  }

  async initializeTransactionPaystack(email: string, amount: number) {
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };

    //Convert amount to kobo for Paystack
    const data = {
      email,
      amount: Math.round(Number(amount) * 100).toString(),
      currency: 'NGN',
    };

    try {
      const response = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        data,
        { headers },
      );
      const user = await this.userModel.query().findOne({ email });
      const account = await this.accountModel
        .query()
        .findOne({ userId: user.id });

      await this.transactionModel.query().insert({
        type: TypeEnum.CREDIT,
        status: StatusEnum.PENDING,
        source: SourceEnum.PAYSTACK,
        description: 'Transaction initialization via Paystack',
        amount,
        senderAccountId: account.id,
        senderName: account.accountName,
      });

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message ||
          'Paystack transaction initialization failed',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async verifyTransactionPaystack(reference: string) {
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
    };

    try {
      const response = await axios.get(
        `https://api.paystack.co/transaction/verify/${reference}`,
        { headers },
      );

      if (response.data.data.status === 'success') {
        const { email } = response.data.data.customer;
        const { amount } = response.data.data;

        await this.accountsService.updateAccountBalance(
          email,
          amount / 100,
          TypeEnum.CREDIT,
        );
        await this.transactionsService.updateTransactionStatus(
          email,
          amount / 100,
          StatusEnum.SUCCESSFUL,
          AccountRoleEnum.SENDER,
        );
      }
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Transaction verification failed',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  //Webhook to handle successful transaction
  async handlePaystackWebhook(body: any) {
    const { event, data } = body;
    if (event === 'charge.success') {
      const { customer, amount } = data;
      const email = customer?.email;

      if (email && amount) {
        await this.accountsService.updateAccountBalance(
          email,
          amount / 100,
          TypeEnum.CREDIT,
        );
        await this.transactionsService.updateTransactionStatus(
          email,
          amount / 100,
          StatusEnum.SUCCESSFUL,
          AccountRoleEnum.SENDER,
        );
      }
    }

    if (event === 'transfer.success') {
      const { recipient, amount } = data;
      const email = recipient?.email;

      if (email && amount) {
        await this.accountsService.updateAccountBalance(
          email,
          amount / 100,
          TypeEnum.DEBIT,
        );
        await this.transactionsService.updateTransactionStatus(
          email,
          amount / 100,
          StatusEnum.SUCCESSFUL,
          AccountRoleEnum.RECEIVER,
        );
      }
    }

    if (event === 'charge.failed') {
      const { customer, amount } = data;
      const email = customer?.email;

      if (email && amount) {
        await this.transactionsService.updateTransactionStatus(
          email,
          amount / 100,
          StatusEnum.FAILED,
          AccountRoleEnum.SENDER,
        );
      }
    }

    if (event === 'transfer.failed') {
      const { recipient, amount } = data;
      const email = recipient?.email;

      if (email && amount) {
        await this.transactionsService.updateTransactionStatus(
          email,
          amount / 100,
          StatusEnum.FAILED,
          AccountRoleEnum.RECEIVER,
        );
      }
    }
  }

  async createTransferRecipientPaystack(
    accountNumber: string,
    bankCode: string,
    name: string,
  ) {
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };

    const data = {
      type: 'nuban',
      name,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: 'NGN',
    };

    try {
      const response = await axios.post(
        'https://api.paystack.co/transferrecipient',
        data,
        { headers },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to create transfer recipient',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async initiateTransferPaystack(
    amount: number,
    recipientCode: string,
    email: string,
    reason?: string,
  ) {
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };

    const data = {
      source: 'balance',
      amount: amount * 100,
      recipient: recipientCode,
      reason,
    };

    try {
      const response = await axios.post(
        'https://api.paystack.co/transfer',
        data,
        { headers },
      );
      const user = await this.userModel.query().findOne({ email });
      const account = await this.accountModel
        .query()
        .findOne({ userId: user.id });
      await this.transactionModel.query().insert({
        type: TypeEnum.DEBIT,
        status: StatusEnum.PENDING,
        source: SourceEnum.PAYSTACK,
        description: reason || 'Transfer via Paystack',
        amount,
        receiverAccountId: account.id,
        receiverName: account.accountName,
      });

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to initiate transfer',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async confirmTransferPaystack(transferCode: string, otp: string) {
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };

    const data = {
      transfer_code: transferCode,
      otp,
    };

    try {
      const response = await axios.post(
        'https://api.paystack.co/transfer/finalize_transfer',
        data,
        { headers },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to finalize transfer',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async verifyTransferPaystack(reference: string) {
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
    };

    try {
      const response = await axios.get(
        `https://api.paystack.co/transfer/verify/${reference}`,
        { headers },
      );

      if (response.data.data.status === 'success') {
        const { email } = response.data.data.recipient;
        const { amount } = response.data.data;

        await this.accountsService.updateAccountBalance(
          email,
          amount / 100,
          TypeEnum.DEBIT,
        );
        await this.transactionsService.updateTransactionStatus(
          email,
          amount / 100,
          StatusEnum.SUCCESSFUL,
          AccountRoleEnum.RECEIVER,
        );
      }

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Transfer verification failed',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async transferFunds(
    senderAccountNumber: string,
    receiverAccountNumber: string,
    amount: number,
  ) {
    if (amount <= 0) {
      throw new HttpException(
        'Amount must be greater than zero',
        HttpStatus.BAD_REQUEST,
      );
    }

    const senderAccount = await this.accountModel
      .query()
      .findOne({ accountNumber: senderAccountNumber });
    const receiverAccount = await this.accountModel
      .query()
      .findOne({ accountNumber: receiverAccountNumber });

    if (!senderAccount) {
      throw new HttpException(
        'You account number is not correct',
        HttpStatus.NOT_FOUND,
      );
    }
    if (!receiverAccount) {
      throw new HttpException(
        'Recipient account number is not correct',
        HttpStatus.NOT_FOUND,
      );
    }

    if (senderAccount.accountBalance < amount) {
      throw new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.accountModel.transaction(async (trx) => {
        senderAccount.accountBalance -= amount;
        await this.accountModel.query(trx).patchAndFetchById(senderAccount.id, {
          accountBalance: senderAccount.accountBalance,
        });

        receiverAccount.accountBalance += amount;
        await this.accountModel
          .query(trx)
          .patchAndFetchById(receiverAccount.id, {
            accountBalance: receiverAccount.accountBalance,
          });

        await this.transactionModel.query(trx).insert({
          type: TypeEnum.DEBIT,
          status: StatusEnum.SUCCESSFUL,
          source: SourceEnum.IN_APP,
          amount,
          senderAccountId: senderAccount.id,
          senderName: senderAccount.accountName,
          receiverAccountId: receiverAccount.id,
          receiverName: receiverAccount.accountName,
          description: `Transfer to ${receiverAccount.accountName}`,
        });

        await this.transactionModel.query(trx).insert({
          type: TypeEnum.CREDIT,
          status: StatusEnum.SUCCESSFUL,
          source: SourceEnum.IN_APP,
          amount,
          senderAccountId: senderAccount.id,
          senderName: senderAccount.accountName,
          receiverAccountId: receiverAccount.id,
          receiverName: receiverAccount.accountName,
          description: `Transfer from ${senderAccount.accountName}`,
        });
      });

      return { message: 'Transfer successful', amount };
    } catch (error) {
      throw new HttpException(
        'Error processing transfer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async listCustomersPaystack() {
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.get('https://api.paystack.co/customer', {
        headers,
      });
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to load customers',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async fetchOneCustomerPaystack(email: string) {
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.get(
        `https://api.paystack.co/customer/${email}`,
        { headers },
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to fetch customer',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async createCustomerPaystack(
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
  ) {
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };

    const data = {
      email,
      first_name: firstName,
      last_name: lastName,
      phone: phoneNumber,
    };

    try {
      const response = await axios.post(
        'https://api.paystack.co/customer',
        data,
        { headers },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to create customer',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async createDedicatedVirtualAccount(customerCode: string) {
    const headers = {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    };

    const data = {
      customer: customerCode,
    };

    try {
      const response = await axios.post(
        'https://api.paystack.co/dedicated_account',
        data,
        { headers },
      );
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message ||
          'Failed to create dedicated virtual account',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }
}
