import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { buildTransactionFilter } from '../filters/query-filter';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import {
  CreateTransactionDto,
  TransactionFilter,
} from './dto/create-transaction.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Transaction } from './entities/transaction.entity';
import {
  AccountRoleEnum,
  IReqUser,
  SourceEnum,
  StatusEnum,
  TypeEnum,
} from '../../src/base.entity';

jest.mock('../filters/query-filter', () => ({
  buildTransactionFilter: jest.fn(),
}));

describe('TransactionsController', () => {
  let controller: TransactionsController;
  let service: DeepMocked<TransactionsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        {
          provide: TransactionsService,
          useValue: createMock<TransactionsService>(),
        },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
    service = module.get(TransactionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTransaction', () => {
    const mockTransactionPayload = new CreateTransactionDto();

    it('should create transaction', async () => {
      jest
        .spyOn(service, 'createTransaction')
        .mockResolvedValue(mockTransactionPayload);

      const account = await controller.createTransaction(
        mockTransactionPayload,
      );

      expect(account).toEqual(mockTransactionPayload);
      expect(service.createTransaction).toHaveBeenCalledWith(
        mockTransactionPayload,
      );
      expect(service.createTransaction).toHaveBeenCalledTimes(1);
    });

    it('should throw error if no correct transaction payload', async () => {
      mockTransactionPayload.senderAccountId = '';
      mockTransactionPayload.senderName = '';
      mockTransactionPayload.receiverAccountId = '';

      jest
        .spyOn(service, 'createTransaction')
        .mockRejectedValue(
          new HttpException(
            'something went wrong while creating transaction',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );

      try {
        await controller.createTransaction(mockTransactionPayload);
      } catch (error) {
        expect(error.message).toBe(
          'something went wrong while creating transaction',
        );
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('getAllTransactions', () => {
    const mockTransactionPayload = new Transaction();
    const mockQueryParams: TransactionFilter = {
      page: 1,
      size: 10,
      senderName: 'John Doe',
      receiverName: 'Janet Isong',
      type: TypeEnum.CREDIT,
      status: StatusEnum.SUCCESSFUL,
      source: SourceEnum.IN_APP,
    };

    const expectedResult = {
      transactions: [mockTransactionPayload],
      pagination: {
        totalRows: 30,
        perPage: 10,
        currentPage: 1,
        totalPages: Math.ceil(30 / 10),
        hasNextPage: 1 < Math.ceil(30 / 10),
      },
    };

    it('should return all transactions with pagination', async () => {
      (buildTransactionFilter as jest.Mock).mockResolvedValue(mockQueryParams);

      jest
        .spyOn(service, 'getAllTransactions')
        .mockResolvedValue(expectedResult);

      const allTransactions =
        await controller.getAllTransactions(mockQueryParams);

      expect(allTransactions).toEqual(expectedResult);

      expect(service.getAllTransactions).toHaveBeenCalledWith(mockQueryParams);
    });

    it('should throw error on failure', async () => {
      mockQueryParams.page = -1;
      mockQueryParams.size = 2;

      jest
        .spyOn(service, 'getAllTransactions')
        .mockRejectedValue(
          new HttpException(
            'Invalid query parameters',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );

      try {
        await controller.getAllTransactions(mockQueryParams);
      } catch (error) {
        expect(error.message).toBe('Invalid query parameters');
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('getTransactionById', () => {
    const transaction_id = 'ae9ef3c3-5795-4731-a113-00797b3bc746';

    it('should get one transaction', async () => {
      const transaction = new CreateTransactionDto();
      jest.spyOn(service, 'getTransactionById').mockResolvedValue(transaction);

      const getAccount = await controller.getTransactionById(transaction_id);

      expect(getAccount).toEqual(transaction);
      expect(service.getTransactionById).toHaveBeenCalledWith(transaction_id);
    });

    it('should an throw error if transaction not found', async () => {
      jest
        .spyOn(service, 'getTransactionById')
        .mockRejectedValue(
          new HttpException(
            `transaction with id: ${transaction_id} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.getTransactionById(transaction_id);
      } catch (error) {
        expect(error.message).toBe(
          `transaction with id: ${transaction_id} not found`,
        );
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('updateTransactionById', () => {
    const transaction_id = 'ef0c7a96-8332-4be3-8bf0-e6fba4c33294';
    const updateData = new Transaction();

    it('should update and return the transaction', async () => {
      jest
        .spyOn(service, 'updateTransactionById')
        .mockResolvedValue(updateData);

      const result = await controller.updateTransactionById(
        transaction_id,
        updateData,
      );

      expect(result).toEqual(updateData);
      expect(service.updateTransactionById).toHaveBeenCalledWith(
        transaction_id,
        updateData,
      );
    });

    it('should throw an error if transaction not found', async () => {
      jest
        .spyOn(service, 'updateTransactionById')
        .mockRejectedValue(
          new HttpException(
            `Transaction with id: ${transaction_id} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.updateTransactionById(transaction_id, updateData);
      } catch (error) {
        expect(error.message).toBe(
          `Transaction with id: ${transaction_id} not found`,
        );
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('deleteTransactionById', () => {
    const transaction_id = '1fa3d721-caba-41b8-ae30-382bc340b33a';
    const user = {
      id: '1fa3d721-caba-41b8-ae30-382bc340b33a',
      role: 'user',
      firstName: 'Jacob',
      lastName: 'Doe',
      email: 'doejacob@gmail.com',
      phoneNumber: '+2349097734459',
      city: 'ibadan',
      photoUrl: 'https://www.photourl.com',
      demoId: 'DEMO-IB-1',
      isVerified: true,
    } as IReqUser;

    it('should delete the transaction by id', async () => {
      jest.spyOn(service, 'deleteTransactionById').mockResolvedValue(undefined);

      const result = await controller.deleteTransactionById(
        transaction_id,
        user,
      );

      expect(result).toBeUndefined();
      expect(service.deleteTransactionById).toHaveBeenCalled();
    });

    it('should throw an error if transaction not found', async () => {
      jest
        .spyOn(service, 'deleteTransactionById')
        .mockRejectedValue(
          new HttpException(
            `Transaction with id: ${transaction_id} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.deleteTransactionById(transaction_id, user);
      } catch (error) {
        expect(error.message).toBe(
          `Transaction with id: ${transaction_id} not found`,
        );
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an error if user is unauthorized to delete the transaction', async () => {
      const unauthorizedUser = { id: 'user456', role: 'user' } as IReqUser;

      jest
        .spyOn(service, 'deleteTransactionById')
        .mockRejectedValue(
          new HttpException(
            "Unauthorized: You cannot delete another user's transaction",
            HttpStatus.UNAUTHORIZED,
          ),
        );

      try {
        await controller.deleteTransactionById(
          transaction_id,
          unauthorizedUser,
        );
      } catch (error) {
        expect(error.message).toBe(
          "Unauthorized: You cannot delete another user's transaction",
        );
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('updateTransactionStatus', () => {
    const email = 'killerbean@gmail.com';
    const amount = 1000;
    const status = StatusEnum.SUCCESSFUL;
    const accountRole = AccountRoleEnum.SENDER;

    const controllerPayload = {
      email,
      amount,
      status,
      accountRole,
    };
    it('should update transaction status', async () => {
      jest
        .spyOn(service, 'updateTransactionStatus')
        .mockResolvedValue(undefined);

      const result =
        await controller.updateTransactionStatus(controllerPayload);

      expect(result).toBeUndefined();
      expect(service.updateTransactionStatus).toHaveBeenCalled();
    });

    it('should throw an error if user not found', async () => {
      jest
        .spyOn(service, 'updateTransactionStatus')
        .mockRejectedValue(
          new HttpException(`User not found`, HttpStatus.NOT_FOUND),
        );

      try {
        await controller.updateTransactionStatus(controllerPayload);
      } catch (error) {
        expect(error.message).toBe(`User not found`);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an error if process fails during transaction status update', async () => {
      jest
        .spyOn(service, 'updateTransactionStatus')
        .mockRejectedValue(
          new HttpException(
            `An error occurred while updating transaction status`,
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        );

      try {
        await controller.updateTransactionStatus(controllerPayload);
      } catch (error) {
        expect(error.message).toBe(
          'An error occurred while updating transaction status',
        );
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      }
    });
  });
});
