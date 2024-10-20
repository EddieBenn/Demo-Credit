import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { GenderEnum, RolesEnum } from 'src/base.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({
    example: '+2348104467932',
    description: 'Phone number of the user',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  phone_number: string;

  @ApiProperty({
    example: 'user@example.com',
    description: 'Email of the user',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'admin', description: 'Role of the user' })
  @IsNotEmpty()
  @IsEnum(RolesEnum)
  role: RolesEnum;

  @ApiProperty({
    example: 'Strongpassword123*',
    description: 'New password of the user',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;

  @ApiProperty({ example: 'male', description: 'Gender of the user' })
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @ApiProperty({ example: 'Lagos', description: 'City of the user' })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({
    example: 'https://www.photourl.com',
    description: 'Photo url of the user',
  })
  @IsOptional()
  @IsString()
  photo_url: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'juliusbenjamin@gmail.com',
    description: 'The email of the user',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password5%',
    description: 'The password of the user',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Strongpassword123*',
    description: 'New password of the user',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  new_password: string;

  @ApiProperty({
    example: 'Strongpassword123@',
    description: 'Confirm password of the user',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'Confirm password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  confirm_password: string;
}

export class VerifyOtpDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @Transform((val) => val.value.toLowerCase())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '204586',
    description: 'One time password',
  })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({
    example: 'Strongpassword123*',
    description: 'New password of the user',
  })
  @IsOptional()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
    {
      message:
        'Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    },
  )
  new_password?: string;
}

export interface IUser {
  id?: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  role: RolesEnum;
  password: string;
  gender: GenderEnum;
  city: string;
  photo_url: string;
  otp: string;
  otp_expiry: Date;
  is_verified: boolean;
  demo_id: string;
}

export interface UserFilter {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  gender: string;
  city: string;
  role: string;
  demo_id: string;
  start_date?: string;
  end_date?: string;
  size?: number;
  page?: number;
}
