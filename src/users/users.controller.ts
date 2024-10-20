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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserFilter } from './dto/create-user.dto';
import { UpdateUserDto, UpdateUserResponseDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { PaginationResponseDto } from './dto/paginate.dto';
import { ADMIN_ROLES, IReqUser } from 'src/base.entity';
import { Roles } from 'src/auth/role.decorator';
import { FileUploadService } from '../utils/cloudinary';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @Post()
  @UseInterceptors(FileInterceptor('photo_url'))
  async createUser(
    @Body() body: CreateUserDto,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const user = req?.user as IReqUser;
      const uploadedPhoto = await this.fileUploadService.upload.single(
        file.path,
      );
      if (uploadedPhoto) {
        body.photo_url = file.path;
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
  getAllAccounts(@Query() query: UserFilter) {
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
  getAccountById(@Param('id', new ParseUUIDPipe()) id: string) {
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
  updateAccountById(
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
  async deleteAccountById(
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
}
