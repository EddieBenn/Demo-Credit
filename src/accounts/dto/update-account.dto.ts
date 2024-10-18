import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAccountDto } from './create-account.dto';

export class UpdateAccountDto extends PartialType(CreateAccountDto) {}

export class UpdateAccountResponseDto {
  @ApiProperty({
    required: false,
    example: 'john doe',
    description: 'Name on account',
  })
  account_name: string;

  @ApiProperty({
    required: false,
    example: '0331183993',
    description: 'Account number',
  })
  account_number: string;

  @ApiProperty({
    required: false,
    example: '100000',
    description: 'Balance of the account',
  })
  account_balance: string;

  @ApiProperty({
    required: false,
    example: 'zenith bank ',
    description: 'Name of the bank',
  })
  bank_name: string;

  @ApiProperty({
    required: false,
    example: '211aabb6-fc31-4851-98d4-f26e4e4f50aa',
    description: 'Id of the user',
  })
  user_id: string;
}
