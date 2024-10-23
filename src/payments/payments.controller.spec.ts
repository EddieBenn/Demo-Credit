import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: DeepMocked<PaymentsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: createMock<PaymentsService>(),
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('initializeTransactionPaystack', () => {
    const controllerPayload = {
      email: 'josephuduak@gmail.com',
      amount: 5000,
    };

    it('should initialize a transaction and return Paystack response data', async () => {
      const paystackResponse = {
        data: {
          status: 'success',
          message: 'Transaction initialized',
          data: { authorization_url: 'https://paystack.com/xyzfhsrihrbsfu' },
        },
      };

      jest
        .spyOn(service, 'initializeTransactionPaystack')
        .mockResolvedValue(paystackResponse);

      const result =
        await controller.initializeTransactionPaystack(controllerPayload);

      expect(result).toEqual(paystackResponse);
      expect(service.initializeTransactionPaystack).toHaveBeenCalledWith(
        controllerPayload.email,
        controllerPayload.amount,
      );
    });

    it('should throw an error if Paystack initialization fails', async () => {
      jest
        .spyOn(service, 'initializeTransactionPaystack')
        .mockRejectedValue(
          new HttpException(
            'Transaction initialization failed',
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        );

      try {
        await controller.initializeTransactionPaystack(controllerPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Transaction initialization failed');
        expect(error.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      }
    });
  });

  describe('verifyTransactionPaystack', () => {
    const reference = 'rjsinsirnwif';

    it('should verify transaction and update account balance and transaction status if successful', async () => {
      const paystackResponse = {
        data: {
          data: {
            status: 'success',
            customer: { email: 'utomobong@gmail.com' },
            amount: 500000,
          },
        },
      };

      jest
        .spyOn(service, 'verifyTransactionPaystack')
        .mockResolvedValue(paystackResponse);

      const result = await controller.verifyTransactionPaystack(reference);

      expect(result).toEqual(paystackResponse);
      expect(service.verifyTransactionPaystack).toHaveBeenCalledWith(reference);
    });

    it('should throw an error if transaction verification fails', async () => {
      jest
        .spyOn(service, 'verifyTransactionPaystack')
        .mockRejectedValue(
          new HttpException(
            'Transaction verification failed',
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        );

      try {
        await service.verifyTransactionPaystack(reference);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Transaction verification failed');
        expect(error.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      }
    });
  });

  describe('handlePaystackWebhook', () => {
    it('should handle charge.success event and update account balance and transaction status', async () => {
      const body = {
        event: 'charge.success',
        data: {
          customer: { email: 'ememabasi@gmail.com' },
          amount: 500000,
        },
      };

      jest.spyOn(service, 'handlePaystackWebhook').mockResolvedValue(undefined);

      const result = await controller.handlePaystackWebhook(body);

      expect(result).toEqual(undefined);
      expect(service.handlePaystackWebhook).toHaveBeenCalledWith(body);
    });

    it('should handle transfer.success event and update account balance and transaction status', async () => {
      const body = {
        event: 'transfer.success',
        data: {
          recipient: { email: 'ememabasi2@gmail.com' },
          amount: 500000,
        },
      };

      jest.spyOn(service, 'handlePaystackWebhook').mockResolvedValue(undefined);

      const result = await controller.handlePaystackWebhook(body);

      expect(result).toEqual(undefined);
      expect(service.handlePaystackWebhook).toHaveBeenCalledWith(body);
    });

    it('should handle charge.failed event and update transaction status', async () => {
      const body = {
        event: 'charge.failed',
        data: {
          customer: { email: 'ememabasi3@gmail.com' },
          amount: 500000,
        },
      };

      jest.spyOn(service, 'handlePaystackWebhook').mockResolvedValue(undefined);

      const result = await controller.handlePaystackWebhook(body);

      expect(result).toEqual(undefined);
      expect(service.handlePaystackWebhook).toHaveBeenCalledWith(body);
    });

    it('should handle transfer.failed event and update transaction status', async () => {
      const body = {
        event: 'transfer.failed',
        data: {
          recipient: { email: 'ememabasi4@gmail.com' },
          amount: 500000,
        },
      };

      jest.spyOn(service, 'handlePaystackWebhook').mockResolvedValue(undefined);

      const result = await controller.handlePaystackWebhook(body);

      expect(result).toEqual(undefined);
      expect(service.handlePaystackWebhook).toHaveBeenCalledWith(body);
    });
  });

  describe('transferFunds', () => {
    const controllerPayload = {
      senderAccountNumber: '1234567890',
      receiverAccountNumber: '0987654321',
      amount: 5000,
    };

    it('should throw an error if the amount is zero or less', async () => {
      jest
        .spyOn(service, 'transferFunds')
        .mockRejectedValue(
          new HttpException(
            'Amount must be greater than zero',
            HttpStatus.BAD_REQUEST,
          ),
        );
      try {
        await controller.transferFunds(controllerPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Amount must be greater than zero');
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should throw an error if the sender account is not found', async () => {
      jest
        .spyOn(service, 'transferFunds')
        .mockRejectedValue(
          new HttpException(
            'Your account number is not correct',
            HttpStatus.NOT_FOUND,
          ),
        );
      try {
        await controller.transferFunds(controllerPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Your account number is not correct');
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an error if the receiver account is not found', async () => {
      jest
        .spyOn(service, 'transferFunds')
        .mockRejectedValue(
          new HttpException(
            'Recipient account number is not correct',
            HttpStatus.NOT_FOUND,
          ),
        );
      try {
        await controller.transferFunds(controllerPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Recipient account number is not correct');
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an error if the sender has insufficient funds', async () => {
      jest
        .spyOn(service, 'transferFunds')
        .mockRejectedValue(
          new HttpException('Insufficient funds', HttpStatus.BAD_REQUEST),
        );
      try {
        await controller.transferFunds(controllerPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Insufficient funds');
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('should successfully transfer funds and update account balances', async () => {
      const expectedResult = {
        message: 'Transfer successful',
        amount: controllerPayload.amount,
      };

      jest.spyOn(service, 'transferFunds').mockResolvedValue(expectedResult);

      const result = await controller.transferFunds(controllerPayload);
      expect(result).toEqual(expectedResult);
      expect(service.transferFunds).toHaveBeenCalledWith(
        controllerPayload.senderAccountNumber,
        controllerPayload.receiverAccountNumber,
        controllerPayload.amount,
      );
      expect(service.transferFunds).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the transfer transaction fails', async () => {
      jest
        .spyOn(service, 'transferFunds')
        .mockRejectedValue(
          new HttpException(
            'Error processing transfer',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );
      try {
        await controller.transferFunds(controllerPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Error processing transfer');
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('listCustomersPaystack', () => {
    it('should return a list of customers from Paystack', async () => {
      const paystackResponse = {
        data: {
          status: true,
          message: 'Customers retrieved',
          data: [
            { id: 90758908, email: 'customer1@gmail.com' },
            { id: 90758301, email: 'customer2@gmail.com' },
          ],
        },
      };

      jest
        .spyOn(service, 'listCustomersPaystack')
        .mockResolvedValue(paystackResponse);

      const result = await controller.listCustomersPaystack();

      expect(result).toEqual(paystackResponse);
      expect(service.listCustomersPaystack).toHaveBeenCalled();
    });

    it('should throw an error if fetching customers from Paystack fails', async () => {
      jest
        .spyOn(service, 'listCustomersPaystack')
        .mockRejectedValue(
          new HttpException(
            'Failed to load customers',
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        );

      try {
        await controller.listCustomersPaystack();
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Failed to load customers');
        expect(error.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      }
    });
  });

  describe('fetchOneCustomerPaystack', () => {
    const customerEmail = 'customer1@gmail.com';

    it('should return customer details from Paystack', async () => {
      const paystackResponse = {
        data: {
          status: true,
          message: 'Customer retrieved',
          data: { id: 90758908, email: customerEmail },
        },
      };

      jest
        .spyOn(service, 'fetchOneCustomerPaystack')
        .mockResolvedValue(paystackResponse);

      const result = await controller.fetchOneCustomerPaystack(customerEmail);

      expect(result).toEqual(paystackResponse);
      expect(service.fetchOneCustomerPaystack).toHaveBeenCalledWith(
        customerEmail,
      );
    });

    it('should throw an error if fetching customer details from Paystack fails', async () => {
      jest
        .spyOn(service, 'fetchOneCustomerPaystack')
        .mockRejectedValue(
          new HttpException(
            'Failed to fetch customer',
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        );

      try {
        await controller.fetchOneCustomerPaystack(customerEmail);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Failed to fetch customer');
        expect(error.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      }
    });
  });

  describe('createCustomerPaystack', () => {
    const customerPayload = {
      email: 'customer1@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '08012345678',
    };

    it('should create a customer on Paystack and return the response data', async () => {
      const paystackResponse = {
        data: {
          status: 'success',
          message: 'Customer created',
          data: { id: 1, email: customerPayload.email },
        },
      };

      jest
        .spyOn(service, 'createCustomerPaystack')
        .mockResolvedValue(paystackResponse);

      const result = await controller.createCustomerPaystack(customerPayload);

      expect(result).toEqual(paystackResponse);
      expect(service.createCustomerPaystack).toHaveBeenCalledWith(
        customerPayload.email,
        customerPayload.firstName,
        customerPayload.lastName,
        customerPayload.phoneNumber,
      );
    });

    it('should throw an error if Paystack customer creation fails', async () => {
      jest
        .spyOn(service, 'createCustomerPaystack')
        .mockRejectedValue(
          new HttpException(
            'Failed to create customer',
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        );

      try {
        await controller.createCustomerPaystack(customerPayload);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Failed to create customer');
        expect(error.getStatus()).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      }
    });
  });
});
