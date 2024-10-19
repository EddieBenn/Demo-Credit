import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Put,
  Req,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  CreateTransactionDto,
  TransactionFilter,
} from './dto/create-transaction.dto';
import {
  UpdateTransactionDto,
  UpdateTransactionResponseDto,
} from './dto/update-transaction.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PaginationResponseDto } from './dto/paginate.dto';
import { ADMIN_ROLES, IReqUser } from 'src/base.entity';
import { Roles } from 'src/auth/role.decorator';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiOperation({ summary: 'Create Transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiCreatedResponse({ type: CreateTransactionDto })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Post()
  async createTransaction(@Body() body: CreateTransactionDto) {
    try {
      return this.transactionsService.createTransaction(body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get All Transactions' })
  @ApiOkResponse({
    type: PaginationResponseDto,
    description: 'Paginated list of transactions',
  })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Roles(ADMIN_ROLES.ADMIN)
  @Get()
  getAllTransactions(@Query() query: TransactionFilter) {
    try {
      return this.transactionsService.getAllTransactions(query);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get One Transaction' })
  @ApiOkResponse({
    type: CreateTransactionDto,
    description: 'Transaction successfully fetched',
  })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Get(':id')
  getTransactionById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.transactionsService.getTransactionById(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get Transactions by Sender Account ID' })
  @ApiOkResponse({
    type: PaginationResponseDto,
    description: 'Transactions successfully fetched by sender_account_id',
  })
  @ApiNotFoundResponse({
    description: 'Transactions not found with the given sender_account_id',
  })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Get('sender/:sender_account_id')
  getTransactionsBySenderId(
    @Param('user_id', new ParseUUIDPipe()) sender_account_id: string,
    @Query() query?: TransactionFilter,
  ) {
    try {
      return this.transactionsService.getTransactionsBySenderId(
        sender_account_id,
        query,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get Transactions by Receiver Account ID' })
  @ApiOkResponse({
    type: PaginationResponseDto,
    description: 'Transactions successfully fetched by receiver_account_id',
  })
  @ApiNotFoundResponse({
    description: 'Transactions not found with the given receiver_account_id',
  })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Get('receiver/:receiver_account_id')
  getTransactionsByReceiverId(
    @Param('user_id', new ParseUUIDPipe()) receiver_account_id: string,
    @Query() query?: TransactionFilter,
  ) {
    try {
      return this.transactionsService.getTransactionsByReceiverId(
        receiver_account_id,
        query,
      );
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update Transaction' })
  @ApiBody({ type: UpdateTransactionResponseDto })
  @ApiOkResponse({ description: 'Transaction successfully updated' })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Put(':id')
  updateTransactionById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTransactionDto,
  ) {
    try {
      return this.transactionsService.updateTransactionById(id, body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete Transaction by ID' })
  @ApiOkResponse({ description: 'Transaction successfully deleted' })
  @ApiNotFoundResponse({ description: 'Transaction not found' })
  @ApiUnauthorizedResponse({
    description: "Unauthorized: You cannot delete another user's transaction",
  })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Delete(':id')
  async deleteAccountById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    const user = req?.user as IReqUser;
    try {
      return await this.transactionsService.deleteTransactionById(id, user);
    } catch (error) {
      throw error;
    }
  }
}
