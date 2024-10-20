import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { GenderEnum } from 'src/base.entity';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateUserResponseDto {
  @ApiProperty({
    required: false,
    example: 'John',
    description: 'First name of the user',
  })
  firstName: string;

  @ApiProperty({
    required: false,
    example: 'Doe',
    description: 'Last name of the user',
  })
  lastName: string;

  @ApiProperty({
    required: false,
    example: '+2348104467932',
    description: 'Phone number of the user',
  })
  phoneNumber: string;

  @ApiProperty({
    required: false,
    example: 'user@example.com',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({
    required: false,
    example: 'male',
    description: 'Gender of the user',
  })
  gender: GenderEnum;

  @ApiProperty({
    required: false,
    example: 'Lagos',
    description: 'City of the user',
  })
  city: string;

  @ApiProperty({
    required: false,
    example: 'https://www.photourl.com',
    description: 'Photo url of the user',
  })
  photoUrl: string;
}
