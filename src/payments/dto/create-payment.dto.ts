import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    required: true,
    example: 'eddie@gmail.com',
    description: 'Email',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: '10000',
    description: 'Amount',
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class CreateTransferRecipientDto {
  @ApiProperty({
    required: true,
    example: '0001234567',
    description: 'Account number',
  })
  @IsNotEmpty()
  @IsString()
  accountNumber: string;

  @ApiProperty({
    required: true,
    example: '058',
    description: 'Bank code',
  })
  @IsNotEmpty()
  @IsString()
  bankCode: string;

  @ApiProperty({
    required: true,
    example: 'John Doe',
    description: 'Name of user initiating transfer',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class InitiateTransferDto {
  @ApiProperty({
    required: true,
    example: 'eddie@gmail.com',
    description: 'Email of user',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: '10000',
    description: 'Amount',
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    required: true,
    example: 'RCP_gx2wn530m0i3w3m',
    description: 'Code for transfer recipient',
  })
  @IsNotEmpty()
  @IsString()
  recipientCode: string;

  @ApiProperty({
    required: true,
    example: 'Calm down',
    description: 'The reason for the transfer',
  })
  @IsString()
  reason?: string;
}

export class ConfirmTransferDto {
  @ApiProperty({
    required: true,
    example: 'TRF_vsyqdmlzble3uii',
    description: 'The transfer code',
  })
  @IsNotEmpty()
  @IsNumber()
  transferCode: string;

  @ApiProperty({
    required: true,
    example: '928783',
    description: 'OTP sent to phone to verify transfer',
  })
  @IsNotEmpty()
  @IsString()
  otp: string;
}

export class TransferFundsDto {
  @ApiProperty({
    required: true,
    example: '0223367997',
    description: 'Sender account number',
  })
  @IsNotEmpty()
  @IsString()
  senderAccountNumber: string;

  @ApiProperty({
    required: true,
    example: '0424468998',
    description: 'Receiver account number',
  })
  @IsNotEmpty()
  @IsString()
  receiverAccountNumber: string;

  @ApiProperty({
    required: true,
    example: '10000',
    description: 'Amount',
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class CreateCustomerDto {
  @ApiProperty({
    required: true,
    example: 'johndoe@gmail.com',
    description: 'Email of customer',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
    example: 'John',
    description: 'First name of customer',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    required: true,
    example: 'Doe',
    description: 'Last name of customer',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    required: true,
    example: '08052795012',
    description: 'Phone number of customer',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;
}
