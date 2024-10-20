import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

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
