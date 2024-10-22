import { Test, TestingModule } from '@nestjs/testing';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { buildAccountFilter } from '../filters/query-filter';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { AccountFilter, CreateAccountDto } from './dto/create-account.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Account } from './entities/account.entity';
import { IReqUser, TypeEnum } from '../base.entity';

jest.mock('../filters/query-filter', () => ({
  buildAccountFilter: jest.fn(),
}));

describe('AccountsController', () => {
  let controller: AccountsController;
  let service: DeepMocked<AccountsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountsController],
      providers: [
        {
          provide: AccountsService,
          useValue: createMock<AccountsService>(),
        },
      ],
    }).compile();

    controller = module.get<AccountsController>(AccountsController);
    service = module.get(AccountsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const mockAccountPayload = new CreateAccountDto();

    it('should create account', async () => {
      jest
        .spyOn(service, 'createAccount')
        .mockResolvedValue(mockAccountPayload);

      const account = await controller.createAccount(mockAccountPayload);

      expect(account).toEqual(mockAccountPayload);
      expect(service.createAccount).toHaveBeenCalledWith(mockAccountPayload);
      expect(service.createAccount).toHaveBeenCalledTimes(1);
    });

    it('should throw error if no correct account payload', async () => {
      mockAccountPayload.accountName = '';
      mockAccountPayload.accountNumber = '';
      mockAccountPayload.bankName = '';

      jest
        .spyOn(service, 'createAccount')
        .mockRejectedValue(
          new HttpException(
            'something went wrong while creating account',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );

      try {
        await controller.createAccount(mockAccountPayload);
      } catch (error) {
        expect(error.message).toBe(
          'something went wrong while creating account',
        );
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('getAllAccounts', () => {
    const mockAccountPayload = new Account();
    const mockQueryParams: AccountFilter = {
      page: 1,
      size: 10,
      accountName: 'John Doe',
      accountNumber: '0231195663',
    };

    const expectedResult = {
      accounts: [mockAccountPayload],
      pagination: {
        totalRows: 20,
        perPage: 10,
        currentPage: 1,
        totalPages: Math.ceil(20 / 10),
        hasNextPage: 1 < Math.ceil(20 / 10),
      },
    };

    it('should return all accounts with pagination', async () => {
      (buildAccountFilter as jest.Mock).mockResolvedValue(mockQueryParams);

      jest.spyOn(service, 'getAllAccounts').mockResolvedValue(expectedResult);

      const allAccounts = await controller.getAllAccounts(mockQueryParams);

      expect(allAccounts).toEqual(expectedResult);

      expect(service.getAllAccounts).toHaveBeenCalledWith(mockQueryParams);
    });

    it('should throw error on failure', async () => {
      mockQueryParams.page = -1;
      mockQueryParams.size = 2;

      jest
        .spyOn(service, 'getAllAccounts')
        .mockRejectedValue(
          new HttpException(
            'Invalid query parameters',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );

      try {
        await controller.getAllAccounts(mockQueryParams);
      } catch (error) {
        expect(error.message).toBe('Invalid query parameters');
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('getAccountById', () => {
    const account_id = 'eec01439-2c27-4bf9-b1ef-137a3e7af70d';

    it('should get one account', async () => {
      const account = new CreateAccountDto();
      jest.spyOn(service, 'getAccountById').mockResolvedValue(account);

      const getAccount = await controller.getAccountById(account_id);

      expect(getAccount).toEqual(account);
      expect(service.getAccountById).toHaveBeenCalledWith(account_id);
    });

    it('should an throw error if account not found', async () => {
      jest
        .spyOn(service, 'getAccountById')
        .mockRejectedValue(
          new HttpException(
            `account with id: ${account_id} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.getAccountById(account_id);
      } catch (error) {
        expect(error.message).toBe(`account with id: ${account_id} not found`);
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('updateAccountById', () => {
    const account_id = '5e3c469e-eb13-4882-9c27-87a53f02eef2';
    const updateData = new Account();

    it('should update and return the account', async () => {
      jest.spyOn(service, 'updateAccountById').mockResolvedValue(updateData);

      const result = await controller.updateAccountById(account_id, updateData);

      expect(result).toEqual(updateData);
      expect(service.updateAccountById).toHaveBeenCalledWith(
        account_id,
        updateData,
      );
    });

    it('should throw an error if account not found', async () => {
      jest
        .spyOn(service, 'updateAccountById')
        .mockRejectedValue(
          new HttpException(
            `Account with id: ${account_id} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.updateAccountById(account_id, updateData);
      } catch (error) {
        expect(error.message).toBe(`Account with id: ${account_id} not found`);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('deleteAccountById', () => {
    const account_id = '1fa3d721-caba-41b8-ae30-382bc340b33a';
    const user = {
      id: 'fb1337c8-fefa-4ee0-a2b4-d9f4e811e695',
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

    it('should delete the account by id', async () => {
      jest.spyOn(service, 'deleteAccountById').mockResolvedValue(undefined);

      const result = await controller.deleteAccountById(account_id, user);

      expect(result).toBeUndefined();
      expect(service.deleteAccountById).toHaveBeenCalled();
    });

    it('should throw an error if account not found', async () => {
      jest
        .spyOn(service, 'deleteAccountById')
        .mockRejectedValue(
          new HttpException(
            `Account with id: ${account_id} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.deleteAccountById(account_id, user);
      } catch (error) {
        expect(error.message).toBe(`Account with id: ${account_id} not found`);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an error if user is unauthorized to delete the account', async () => {
      const unauthorizedUser = { id: 'user456', role: 'user' } as IReqUser;

      jest
        .spyOn(service, 'deleteAccountById')
        .mockRejectedValue(
          new HttpException(
            "Unauthorized: You cannot delete another user's account",
            HttpStatus.UNAUTHORIZED,
          ),
        );

      try {
        await controller.deleteAccountById(account_id, unauthorizedUser);
      } catch (error) {
        expect(error.message).toBe(
          "Unauthorized: You cannot delete another user's account",
        );
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('updateAccountBalance', () => {
    const email = 'user@example.com';
    const amount = 100;
    const operation = TypeEnum.CREDIT;

    const controllerPayload = {
      email,
      amount,
      operation,
    };
    it('should update account balance', async () => {
      jest.spyOn(service, 'updateAccountBalance').mockResolvedValue(undefined);

      const result = await controller.updateAccountBalance(controllerPayload);

      expect(result).toBeUndefined();
      expect(service.updateAccountBalance).toHaveBeenCalled();
    });

    it('should throw an error if user not found', async () => {
      jest
        .spyOn(service, 'updateAccountBalance')
        .mockRejectedValue(
          new HttpException(
            `User with email: ${email} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.updateAccountBalance(controllerPayload);
      } catch (error) {
        expect(error.message).toBe(`User with email: ${email} not found`);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an error if process fails during balance update', async () => {
      jest
        .spyOn(service, 'updateAccountBalance')
        .mockRejectedValue(
          new HttpException(
            `An error occurred while updating account balance`,
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        );

      try {
        await controller.updateAccountBalance(controllerPayload);
      } catch (error) {
        expect(error.message).toBe(
          'An error occurred while updating account balance',
        );
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      }
    });
  });
});
