import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { buildUserFilter } from '../filters/query-filter';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { CreateUserDto, LoginDto, UserFilter } from './dto/create-user.dto';
import { FileUploadService } from 'src/utils/cloudinary';
import { IReqUser } from '../../src/base.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Response } from 'express';

jest.mock('../filters/query-filter', () => ({
  buildUserFilter: jest.fn(),
}));

describe('UsersController', () => {
  let controller: UsersController;
  let service: DeepMocked<UsersService>;
  let fileService: DeepMocked<FileUploadService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: createMock<UsersService>(),
        },
        {
          provide: FileUploadService,
          useValue: createMock<FileUploadService>(),
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get(UsersService);
    fileService = module.get(FileUploadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('fileService should be defined', () => {
    expect(fileService).toBeDefined();
  });

  describe('createUser', () => {
    const user = {
      id: '6cfbbed4-3a36-4916-bd58-7ef3439f29f3',
      role: 'user',
      firstName: 'Jacob',
      lastName: 'Doe',
      email: 'doejacob@gmail.com',
      phoneNumber: '+2349097734459',
      city: 'ibadan',
      photoUrl: 'https://www.photourl.com',
      demoId: 'DEMO-IB-1',
      isVerified: true,
    } as IReqUser;

    const mockUserPayload = new CreateUserDto();

    const mockFileUploadResponse = {
      secure_url: 'https://www.photourl.com',
      message: 'Here is yout image url',
      name: 'Image Url',
      http_code: 201,
      url: 'https://www.photourl.com',
    };

    const file = {
      originalname: 'profile.jpg',
      mimetype: 'image/jpeg',
      buffer: Buffer.from('test-image'),
      size: 1024,
    } as Express.Multer.File;

    it('should create user', async () => {
      jest.spyOn(service, 'createUser').mockResolvedValue(mockUserPayload);
      jest
        .spyOn(fileService, 'uploadFile')
        .mockResolvedValue(mockFileUploadResponse);

      const createdUser = await controller.createUser(
        mockUserPayload,
        user,
        file,
      );

      expect(createdUser).toEqual(mockUserPayload);
      expect(service.createUser).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if user is on karma list', async () => {
      jest
        .spyOn(service, 'createUser')
        .mockRejectedValue(
          new HttpException(
            `User with email ${user.email} is on the Karma blacklist for Others`,
            HttpStatus.UNPROCESSABLE_ENTITY,
          ),
        );

      try {
        await controller.createUser(mockUserPayload, user, file);
      } catch (error) {
        expect(error.message).toBe(
          `User with email ${user.email} is on the Karma blacklist for Others`,
        );
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
      }
    });

    it('should throw error if no correct user payload', async () => {
      mockUserPayload.email = '';
      mockUserPayload.firstName = '';
      mockUserPayload.lastName = '';

      jest
        .spyOn(service, 'createUser')
        .mockRejectedValue(
          new HttpException(
            'something went wrong while creating user',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );

      try {
        await controller.createUser(mockUserPayload, user, file);
      } catch (error) {
        expect(error.message).toBe('something went wrong while creating user');
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('getAllUsers', () => {
    const mockUserPayload = new User();
    const mockQueryParams: UserFilter = {
      page: 1,
      size: 10,
      firstName: 'John',
      lastName: 'Isong',
      email: 'democredit01@gmail.com',
      phoneNumber: '+2348085589824',
      gender: 'male',
      city: 'ibadab',
      role: 'user',
      demoId: 'DEMO-IB-200',
    };

    const expectedResult = {
      users: [mockUserPayload],
      pagination: {
        totalRows: 30,
        perPage: 10,
        currentPage: 1,
        totalPages: Math.ceil(30 / 10),
        hasNextPage: 1 < Math.ceil(30 / 10),
      },
    };

    it('should return all users with pagination', async () => {
      (buildUserFilter as jest.Mock).mockResolvedValue(mockQueryParams);

      jest.spyOn(service, 'getAllUsers').mockResolvedValue(expectedResult);

      const allTransactions = await controller.getAllUsers(mockQueryParams);

      expect(allTransactions).toEqual(expectedResult);
      expect(service.getAllUsers).toHaveBeenCalledWith(mockQueryParams);
    });

    it('should throw error on failure', async () => {
      mockQueryParams.page = -1;
      mockQueryParams.size = 2;

      jest
        .spyOn(service, 'getAllUsers')
        .mockRejectedValue(
          new HttpException(
            'Invalid query parameters',
            HttpStatus.INTERNAL_SERVER_ERROR,
          ),
        );

      try {
        await controller.getAllUsers(mockQueryParams);
      } catch (error) {
        expect(error.message).toBe('Invalid query parameters');
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });
  });

  describe('getUserById', () => {
    const user_id = 'ef0c7a96-8332-4be3-8bf0-e6fba4c33294';

    it('should get one user', async () => {
      const user = new CreateUserDto();
      jest.spyOn(service, 'getUserById').mockResolvedValue(user);

      const getUser = await controller.getUserById(user_id);

      expect(getUser).toEqual(user);
      expect(service.getUserById).toHaveBeenCalledWith(user_id);
    });

    it('should throw error if user not found', async () => {
      jest
        .spyOn(service, 'getUserById')
        .mockRejectedValue(
          new HttpException(
            `user with id: ${user_id} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.getUserById(user_id);
      } catch (error) {
        expect(error.message).toBe(`user with id: ${user_id} not found`);
        expect(error).toBeInstanceOf(Error);
      }
    });
  });

  describe('updateUserById', () => {
    const user_id = 'f16fab5b-a568-4084-8092-408d4d9d892f';
    const updateData = new User();

    it('should update and return the user', async () => {
      jest.spyOn(service, 'updateUserById').mockResolvedValue(updateData);

      const result = await controller.updateUserById(user_id, updateData);

      expect(result).toEqual(updateData);
      expect(service.updateUserById).toHaveBeenCalledWith(user_id, updateData);
    });

    it('should throw an error if user not found', async () => {
      jest
        .spyOn(service, 'updateUserById')
        .mockRejectedValue(
          new HttpException(
            `User with id: ${user_id} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.updateUserById(user_id, updateData);
      } catch (error) {
        expect(error.message).toBe(`User with id: ${user_id} not found`);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('deleteUserById', () => {
    const user_id = '8657f4cb-316d-4e7a-a88a-57d98d8228f5';
    const user = {
      id: '8657f4cb-316d-4e7a-a88a-57d98d8228f5',
      role: 'user',
      firstName: 'Jacob',
      lastName: 'Doe',
      email: 'doejacob@gmail.com',
      phoneNumber: '+2349097734459',
      city: 'ibadan',
      photoUrl: 'https://www.photourl.com',
      demoId: 'DEMO-IB-300',
      isVerified: true,
    } as IReqUser;

    it('should delete the user by id', async () => {
      jest.spyOn(service, 'deleteUserById').mockResolvedValue(undefined);

      const result = await controller.deleteUserById(user_id, user);

      expect(result).toBeUndefined();
      expect(service.deleteUserById).toHaveBeenCalled();
    });

    it('should throw an error if user not found', async () => {
      jest
        .spyOn(service, 'deleteUserById')
        .mockRejectedValue(
          new HttpException(
            `User with id: ${user_id} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.deleteUserById(user_id, user);
      } catch (error) {
        expect(error.message).toBe(`User with id: ${user_id} not found`);
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });

    it('should throw an error if user is unauthorized to delete another user', async () => {
      const unauthorizedUser = {
        id: '8657f4cb-316d-4e7a-a88a-57d98d8228f5',
        role: 'user',
      } as IReqUser;

      jest
        .spyOn(service, 'deleteUserById')
        .mockRejectedValue(
          new HttpException(
            'Unauthorized: You cannot delete another user',
            HttpStatus.UNAUTHORIZED,
          ),
        );

      try {
        await controller.deleteUserById(user_id, unauthorizedUser);
      } catch (error) {
        expect(error.message).toBe(
          'Unauthorized: You cannot delete another user',
        );
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.UNAUTHORIZED);
      }
    });
  });

  describe('loginUser', () => {
    const mockLoginDto: LoginDto = {
      email: 'doejohn@gmail.com',
      password: 'password123',
    };

    const expressResponse: any = {};

    const mockResponse = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    it('should update and return the user', async () => {
      jest.spyOn(service, 'loginUser').mockResolvedValue(mockResponse);

      const result = await controller.login(mockLoginDto, expressResponse);

      expect(result).toEqual(mockResponse);
      expect(service.loginUser).toHaveBeenCalledWith(
        mockLoginDto,
        expressResponse,
      );
    });

    it('should throw an error if user not found', async () => {
      jest
        .spyOn(service, 'loginUser')
        .mockRejectedValue(
          new HttpException(
            `User with email: ${mockLoginDto.email} not found`,
            HttpStatus.NOT_FOUND,
          ),
        );

      try {
        await controller.login(mockLoginDto, expressResponse);
      } catch (error) {
        expect(error.message).toBe(
          `User with email: ${mockLoginDto.email} not found`,
        );
        expect(error).toBeInstanceOf(HttpException);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });

  describe('logoutUser', () => {
    const mockResponse = {
      clearCookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const expressResponse: any = {};

    it('should logout user by clearing the access_token cookie', async () => {
      jest.spyOn(service, 'logoutUser').mockResolvedValue(mockResponse);

      const result = await controller.logout(expressResponse);

      expect(result).toEqual(mockResponse);
      expect(service.logoutUser).toHaveBeenCalledWith(expressResponse);
    });
  });
});
