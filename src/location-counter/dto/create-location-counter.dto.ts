import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { RolesEnum } from 'src/base.entity';

export class CreateLocationCounterDto {
  @ApiProperty({ example: 'lagos', description: 'City name' })
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty({ example: 'Nigeria', description: 'Country of each city' })
  @IsNotEmpty()
  @IsString()
  country: string;

  @ApiProperty({
    example: 1,
    description: 'No of people registered in that city',
  })
  @IsNotEmpty()
  @IsNumber()
  count: number;

  @ApiProperty({ example: 'LA', description: 'Code of each city' })
  @IsNotEmpty()
  @IsString()
  cityCode: string;

  @ApiProperty({ example: 'admin', description: 'Role of the user' })
  @IsNotEmpty()
  @IsEnum(RolesEnum)
  role: RolesEnum;
}

export interface LocationCounterFilter {
  city?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  isPaginate?: boolean;
  size?: number;
  page?: number;
}
