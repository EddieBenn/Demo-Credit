import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { IReqUser } from '../base.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  async generateToken(@Body() user: IReqUser) {
    try {
      return this.authService.generateToken(user);
    } catch (error) {
      throw error;
    }
  }
}
