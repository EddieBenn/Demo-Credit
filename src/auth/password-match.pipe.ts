/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PasswordMatch implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { newPassword, confirmPassword } = value;

    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    return value;
  }
}
