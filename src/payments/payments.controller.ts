import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  ConfirmTransferDto,
  CreateCustomerDto,
  CreatePaymentDto,
  CreateTransferRecipientDto,
  InitiateTransferDto,
  TransferFundsDto,
} from './dto/create-payment.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@ApiTags('Payment')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: 'Initiate Payment' })
  @ApiBody({ type: CreatePaymentDto })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('initialize/paystack')
  async initializeTransactionPaystack(@Body() body: CreatePaymentDto) {
    const { email, amount } = body;
    try {
      return await this.paymentsService.initializeTransactionPaystack(
        email,
        amount,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Verify Payment' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('verify/:reference')
  async verifyTransactionPaystack(@Param('reference') reference: string) {
    try {
      return await this.paymentsService.verifyTransactionPaystack(reference);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Fulfil Payment Webhook' })
  @ApiSecurity('access_token')
  @Post('webhook/paystack')
  async handlePaystackWebhook(@Body() body: any) {
    try {
      return await this.paymentsService.handlePaystackWebhook(body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Create Transfer Recipient on Paystack' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('transfer-recipient/paystack')
  async createTransferRecipientPaystack(
    @Body() body: CreateTransferRecipientDto,
  ) {
    const { accountNumber, bankCode, name } = body;
    try {
      return await this.paymentsService.createTransferRecipientPaystack(
        accountNumber,
        bankCode,
        name,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Initiate Transfer via Paystack' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('initiate-transfer/paystack')
  async initiateTransferPaystack(@Body() body: InitiateTransferDto) {
    const { amount, recipientCode, email, reason } = body;
    try {
      return await this.paymentsService.initiateTransferPaystack(
        amount,
        recipientCode,
        email,
        reason,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Confirm Transfer via Paystack' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('confirm-transfer')
  async confirmTransferPaystack(@Body() body: ConfirmTransferDto) {
    const { transferCode, otp } = body;
    try {
      return await this.paymentsService.confirmTransferPaystack(
        transferCode,
        otp,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Verify Transfer via Paystack' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('verify-transfer/:reference')
  async verifyTransferPaystack(@Param('reference') reference: string) {
    try {
      return await this.paymentsService.verifyTransferPaystack(reference);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Transfer Funds' })
  @ApiOkResponse({ description: 'Funds transferred successfully' })
  @ApiBadRequestResponse({
    description: 'Invalid request or insufficient funds',
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('transfer')
  async transferFunds(@Body() body: TransferFundsDto) {
    const { senderAccountNumber, receiverAccountNumber, amount } = body;
    try {
      return await this.paymentsService.transferFunds(
        senderAccountNumber,
        receiverAccountNumber,
        amount,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'List Customers on Paystack' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Get('customers/paystack')
  async listCustomersPaystack() {
    try {
      return await this.paymentsService.listCustomersPaystack();
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get One Customer on Paystack' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('customer/get-one/:email')
  async fetchOneCustomerPaystack(@Param('email') email: string) {
    try {
      return await this.paymentsService.fetchOneCustomerPaystack(email);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Create Customer on Paystack' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('create-customer/paystack')
  async createCustomerPaystack(@Body() body: CreateCustomerDto) {
    const { email, firstName, lastName, phoneNumber } = body;
    try {
      return await this.paymentsService.createCustomerPaystack(
        email,
        firstName,
        lastName,
        phoneNumber,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Create Dedicated Virtual Account on Paystack' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('create/virtual-account/:customerCode')
  async createDedicatedVirtualAccount(
    @Param('customerCode') customerCode: string,
  ) {
    try {
      return await this.paymentsService.createDedicatedVirtualAccount(
        customerCode,
      );
    } catch (error) {
      throw error;
    }
  }
}
