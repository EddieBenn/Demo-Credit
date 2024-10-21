import { Controller, Post, Body, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PaymentsService } from './payments.service';
import {
  ConfirmTransferDto,
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
  async initializeTransactionPaystack(
    @Body() body: CreatePaymentDto,
    @Res() res: Response,
  ) {
    const { email, amount } = body;
    const transaction =
      await this.paymentsService.initializeTransactionPaystack(email, amount);
    return res.status(200).json(transaction);
  }

  @ApiOperation({ summary: 'Verify Payment' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('verify/:reference')
  async verifyTransactionPaystack(
    @Param('reference') reference: string,
    @Res() res: Response,
  ) {
    const transaction =
      await this.paymentsService.verifyTransactionPaystack(reference);
    return res.status(200).json(transaction);
  }

  @ApiOperation({ summary: 'Fulfil Payment Webhook' })
  @ApiSecurity('access_token')
  @Post('webhook/paystack')
  async handlePaystackWebhook(@Body() body: any, @Res() res: Response) {
    const webhook = await this.paymentsService.handlePaystackWebhook(body);
    return res.status(200).json(webhook);
  }

  @ApiOperation({ summary: 'Create Transfer Recipient on Paystack' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('transfer-recipient/paystack')
  async createTransferRecipientPaystack(
    @Body() body: CreateTransferRecipientDto,
    @Res() res: Response,
  ) {
    const { accountNumber, bankCode, name } = body;
    try {
      const recipient =
        await this.paymentsService.createTransferRecipientPaystack(
          accountNumber,
          bankCode,
          name,
        );
      return res.status(200).json(recipient);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Initiate Transfer via Paystack' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('initiate-transfer/paystack')
  async initiateTransferPaystack(
    @Body() body: InitiateTransferDto,
    @Res() res: Response,
  ) {
    const { amount, recipientCode, email, reason } = body;
    try {
      const transfer = await this.paymentsService.initiateTransferPaystack(
        amount,
        recipientCode,
        email,
        reason,
      );
      return res.status(200).json(transfer);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Confirm Transfer via Paystack' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('confirm-transfer')
  async confirmTransferPaystack(
    @Body() body: ConfirmTransferDto,
    @Res() res: Response,
  ) {
    const { transferCode, otp } = body;
    try {
      const result = await this.paymentsService.confirmTransferPaystack(
        transferCode,
        otp,
      );
      return res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Verify Transfer via Paystack' })
  @ApiUnprocessableEntityResponse()
  @ApiSecurity('access_token')
  @Post('verify-transfer/:reference')
  async verifyTransferPaystack(
    @Param('reference') reference: string,
    @Res() res: Response,
  ) {
    try {
      const result =
        await this.paymentsService.verifyTransferPaystack(reference);
      return res.status(200).json(result);
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
  async transferFunds(@Body() body: TransferFundsDto, @Res() res: Response) {
    const { senderAccountNumber, receiverAccountNumber, amount } = body;
    try {
      const result = await this.paymentsService.transferFunds(
        senderAccountNumber,
        receiverAccountNumber,
        amount,
      );
      return res.status(200).json(result);
    } catch (error) {
      throw error;
    }
  }
}
