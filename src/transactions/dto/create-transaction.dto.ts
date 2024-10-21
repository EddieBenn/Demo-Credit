import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import {
  AccountRoleEnum,
  SourceEnum,
  StatusEnum,
  TypeEnum,
} from 'src/base.entity';

export class CreateTransactionDto {
  @ApiProperty({
    required: true,
    example: 'credit',
    description: 'The type of transaction',
  })
  @IsNotEmpty()
  @IsEnum(TypeEnum)
  type: TypeEnum;

  @ApiProperty({
    required: true,
    example: 'pending',
    description: 'The status of the transaction',
  })
  @IsNotEmpty()
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty({
    required: true,
    example: 'paystack',
    description: 'The source of the transaction',
  })
  @IsNotEmpty()
  @IsEnum(SourceEnum)
  source: SourceEnum;

  @ApiProperty({
    required: true,
    example: '10000',
    description: 'Amount transferred',
  })
  @IsNotEmpty()
  @IsNumber()
  @MinLength(2)
  amount: number;

  @ApiProperty({
    required: false,
    example: '211aabb6-fc31-4851-98d4-f26e4e4f50aa',
    description: 'Account UUID of the sender',
  })
  @IsUUID()
  senderAccountId?: string;

  @ApiProperty({
    required: false,
    example: 'caesar augustus',
    description: 'Name of the sender',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsString()
  senderName?: string;

  @ApiProperty({
    required: false,
    example: '211aabb6-fc31-4851-98d4-f26e4e4f50aa',
    description: 'Account UUID of the receiver',
  })
  @IsUUID()
  receiverAccountId?: string;

  @ApiProperty({
    required: false,
    example: 'julius caesar',
    description: 'Name of the receiver',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsString()
  receiverName?: string;
}

export class UpdateTransactionStatusDto {
  @ApiProperty({
    required: true,
    example: 'johndoe@gmail.com',
    description: `User's email`,
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: '1000',
    description: 'AMount to debit or credit',
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ example: 'pending', description: 'Status of transaction' })
  @IsNotEmpty()
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @ApiProperty({ example: 'sender', description: 'sender or receiver' })
  @IsNotEmpty()
  @IsEnum(AccountRoleEnum)
  accountRole: AccountRoleEnum;
}

export interface TransactionFilter {
  type?: string;
  status?: string;
  source?: string;
  amount?: string;
  senderAccountId?: string;
  senderName?: string;
  receiverAccountId?: string;
  receiverName?: string;
  startDate?: string;
  endDate?: string;
  isPaginate?: boolean;
  size?: number;
  page?: number;
}
