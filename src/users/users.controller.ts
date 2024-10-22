import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Put,
  Req,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  ForgotPasswordDto,
  LoginDto,
  UserFilter,
  VerifyOtpDto,
} from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserResponseDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PaginationResponseDto } from './dto/paginate-user.dto';
import { ADMIN_ROLES, IReqUser } from '../base.entity';
import { Roles } from 'src/auth/role.decorator';
import { FileUploadService } from '../utils/cloudinary';
import { FileInterceptor } from '@nestjs/platform-express';
import { SkipAuth } from '../auth/auth.decorator';
import { PasswordMatch } from '../auth/password-match.pipe';
import { Response } from 'express';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @ApiOperation({ summary: 'Create User' })
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ type: CreateUserDto })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @SkipAuth()
  @Post()
  @UseInterceptors(FileInterceptor('photoUrl'))
  async createUser(
    @Body() body: CreateUserDto,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const user = req?.user as IReqUser;
      const uploadedPhoto = await this.fileUploadService.uploadFile(file);
      if (uploadedPhoto) {
        body.photoUrl = uploadedPhoto.secure_url;
      }
      return this.usersService.createUser(body, user);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get All Users' })
  @ApiOkResponse({
    type: PaginationResponseDto,
    description: 'Paginated list of users',
  })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Roles(ADMIN_ROLES.ADMIN)
  @Get()
  getAllUsers(@Query() query: UserFilter) {
    try {
      return this.usersService.getAllUsers(query);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Get One User' })
  @ApiOkResponse({
    type: CreateUserDto,
    description: 'User successfully fetched',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Get(':id')
  getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    try {
      return this.usersService.getUserById(id);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Update User' })
  @ApiBody({ type: UpdateUserResponseDto })
  @ApiOkResponse({ description: 'User successfully updated' })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Put(':id')
  updateUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateUserDto,
  ) {
    try {
      return this.usersService.updateUserById(id, body);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Delete User by ID' })
  @ApiOkResponse({ description: 'User successfully deleted' })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({
    description: 'Unauthorized: You cannot delete another user',
  })
  @ApiBadRequestResponse()
  @ApiSecurity('access_token')
  @Delete(':id')
  async deleteUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: any,
  ) {
    const user = req?.user as IReqUser;
    try {
      return await this.usersService.deleteUserById(id, user);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Reset User Password' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiOkResponse({
    description: 'OTP has been sent to your email for password reset',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse()
  @Post('forgot-password')
  @SkipAuth()
  @UsePipes(PasswordMatch)
  async forgotPassword(@Body() body: ForgotPasswordDto, @Res() res: Response) {
    try {
      return this.usersService.forgotPassword(body, res);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'Verify OTP' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({
    status: 200,
    description: 'User verified or password reset successful',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'OTP is invalid or expired' })
  @SkipAuth()
  @Post('verify-otp')
  async verifyOTP(@Body() data: VerifyOtpDto, @Res() res: Response) {
    try {
      return this.usersService.verifyOTP(data, res);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({ summary: 'User Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful, access token generated',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiUnauthorizedResponse({ description: 'Invalid password' })
  @ApiCookieAuth('access_token')
  @SkipAuth()
  @Post('login')
  async login(@Body() data: LoginDto, @Res() res: Response) {
    try {
      return await this.usersService.loginUser(data, res);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Logout User',
    description: 'User successfully logged out',
  })
  @ApiOkResponse()
  @ApiBadRequestResponse()
  @Post('logout')
  async logout(@Res() res: Response) {
    try {
      return this.usersService.logoutUser(res);
    } catch (error) {
      throw error;
    }
  }
}
