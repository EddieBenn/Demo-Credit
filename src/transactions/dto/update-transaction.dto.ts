import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';
import { SourceEnum, StatusEnum, TypeEnum } from 'src/base.entity';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}

export class UpdateTransactionResponseDto {
  @ApiProperty({
    required: false,
    example: 'credit',
    description: 'The type of transaction',
  })
  type: TypeEnum;

  @ApiProperty({
    required: false,
    example: 'pending',
    description: 'The status of the transaction',
  })
  status: StatusEnum;

  @ApiProperty({
    required: false,
    example: 'paystack',
    description: 'The source of the transaction',
  })
  source: SourceEnum;

  @ApiProperty({
    required: false,
    example: '10000',
    description: 'Amount transferred',
  })
  amount: number;

  @ApiProperty({
    required: false,
    example: '211aabb6-fc31-4851-98d4-f26e4e4f50aa',
    description: 'Account UUID of the sender',
  })
  senderAccountId: string;

  @ApiProperty({
    required: false,
    example: 'caesar augustus',
    description: 'Name of the sender',
  })
  senderName: string;

  @ApiProperty({
    required: false,
    example: '211aabb6-fc31-4851-98d4-f26e4e4f50aa',
    description: 'Account UUID of the receiver',
  })
  receiverAccountId: string;

  @ApiProperty({
    required: false,
    example: 'julius caesar',
    description: 'Name of the receiver',
  })
  receiverName: string;
}
