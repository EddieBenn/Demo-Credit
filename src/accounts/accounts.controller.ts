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
import { AccountsService } from './accounts.service';
import { AccountFilter, CreateAccountDto } from './dto/create-account.dto';
import {
  UpdateAccountDto,
  UpdateAccountResponseDto,
} from './dto/update-account.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PaginationResponseDto } from './dto/paginate.dto';
import { ADMIN_ROLES, IReqUser } from 'src/base.entity';
import { Roles } from 'src/auth/role.decorator';

@ApiTags('Account')
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiOperation({ summary: 'Create Account' })
  @ApiBody({ type: CreateAccountDto })
  @ApiCreatedResponse({ type: CreateAccountDto })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Post()
  async createAccount(@Body() body: CreateAccountDto) {
    try {
      return this.accountsService.createAccount(body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get All Accounts' })
  @ApiOkResponse({
    type: PaginationResponseDto,
    description: 'Paginated list of accounts',
  })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Roles(ADMIN_ROLES.ADMIN)
  @Get()
  getAllAccounts(@Query() query: AccountFilter) {
    try {
      return this.accountsService.getAllAccounts(query);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get One Account' })
  @ApiOkResponse({
    type: CreateAccountDto,
    description: 'Account successfully fetched',
  })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Get(':id')
  getAccountById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.accountsService.getAccountById(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get Account by User ID' })
  @ApiOkResponse({
    type: CreateAccountDto,
    description: 'Account successfully fetched by user_id',
  })
  @ApiNotFoundResponse({
    description: 'Account not found with the given user_id',
  })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Get('user/:userId')
  getAccountByUserId(@Param('userId', new ParseUUIDPipe()) userId: string) {
    try {
      return this.accountsService.getAccountByUserId(userId);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update Account' })
  @ApiBody({ type: UpdateAccountResponseDto })
  @ApiOkResponse({ description: 'Account successfully updated' })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Put(':id')
  updateAccountById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateAccountDto,
  ) {
    try {
      return this.accountsService.updateAccountById(id, body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete Account by ID' })
  @ApiOkResponse({ description: 'Account successfully deleted' })
  @ApiNotFoundResponse({ description: 'Account not found' })
  @ApiUnauthorizedResponse({
    description: "Unauthorized: You cannot delete another user's account",
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
      return await this.accountsService.deleteAccountById(id, user);
    } catch (error) {
      throw error;
    }
  }
}
