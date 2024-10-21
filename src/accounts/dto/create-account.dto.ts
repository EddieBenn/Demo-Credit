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
import { TypeEnum } from 'src/base.entity';

export class CreateAccountDto {
  @ApiProperty({
    required: true,
    example: 'john doe',
    description: 'Name on account',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  accountName: string;

  @ApiProperty({
    required: true,
    example: '0331183993',
    description: 'Account number',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  accountNumber: string;

  @ApiProperty({
    required: true,
    example: 'zenith bank ',
    description: 'Name of the bank',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  bankName: string;

  @ApiProperty({
    required: true,
    example: '211aabb6-fc31-4851-98d4-f26e4e4f50aa',
    description: 'Id of the user',
  })
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}

export class UpdateBalanceDto {
  @ApiProperty({
    required: true,
    example: 'johndoe@gmail.com',
    description: 'Users email',
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

  @ApiProperty({ example: 'credit', description: 'Type of transaction' })
  @IsNotEmpty()
  @IsEnum(TypeEnum)
  operation: TypeEnum;
}

export interface AccountFilter {
  accountName?: string;
  accountNumber?: string;
  bankName?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
  isPaginate?: boolean;
  size?: number;
  page?: number;
}
