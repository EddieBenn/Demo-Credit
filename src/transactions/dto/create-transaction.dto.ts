import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { StatusEnum, TypeEnum } from 'src/base.entity';

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
    example: '10000',
    description: 'Amount transferred',
  })
  @IsNotEmpty()
  @IsNumber()
  @MinLength(2)
  amount: number;

  @ApiProperty({
    required: true,
    example: '211aabb6-fc31-4851-98d4-f26e4e4f50aa',
    description: 'Account UUID of the sender',
  })
  @IsNotEmpty()
  @IsUUID()
  senderAccountId: string;

  @ApiProperty({
    required: true,
    example: 'caesar augustus',
    description: 'Name of the sender',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  senderName: string;

  @ApiProperty({
    required: true,
    example: '211aabb6-fc31-4851-98d4-f26e4e4f50aa',
    description: 'Account UUID of the receiver',
  })
  @IsNotEmpty()
  @IsUUID()
  receiverAccountId: string;

  @ApiProperty({
    required: true,
    example: 'julius caesar',
    description: 'Name of the receiver',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  receiverName: string;
}

export interface TransactionFilter {
  type?: string;
  status?: string;
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
