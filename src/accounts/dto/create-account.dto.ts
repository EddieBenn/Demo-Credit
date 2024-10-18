import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateAccountDto {
  @ApiProperty({
    required: true,
    example: 'john doe',
    description: 'Name on account',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  account_name: string;

  @ApiProperty({
    required: true,
    example: '0331183993',
    description: 'Account number',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  account_number: string;

  @ApiProperty({
    required: true,
    example: '100000',
    description: 'Balance of the account',
  })
  @IsNotEmpty()
  @IsNumber()
  account_balance: number;

  @ApiProperty({
    required: true,
    example: 'zenith bank ',
    description: 'Name of the bank',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  bank_name: string;

  @ApiProperty({
    required: true,
    example: '211aabb6-fc31-4851-98d4-f26e4e4f50aa',
    description: 'Id of the user',
  })
  @IsNotEmpty()
  @IsUUID()
  user_id: string;
}

export interface AccountFilter {
  account_name?: string;
  account_number?: string;
  bank_name?: string;
  user_id?: string;
  start_date?: string;
  end_date?: string;
  isPaginate?: boolean;
  size?: number;
  page?: number;
}
