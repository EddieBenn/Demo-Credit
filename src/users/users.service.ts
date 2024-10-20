import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto, IUser, UserFilter } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ModelClass } from 'objection';
import { LocationCounterService } from 'src/location-counter/location-counter.service';
import { UtilService } from 'src/utils/utility-service';
import { myTransaction } from 'src/utils/transaction';
import { sendMail } from 'src/utils/nodemailer';
import { IReqUser, RolesEnum } from 'src/base.entity';
import { buildUserFilter } from 'src/filters/query-filter';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';
import { AccountsService } from 'src/accounts/accounts.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('User')
    private readonly userModel: ModelClass<User>,
    private readonly locationCounterService: LocationCounterService,
    private readonly accountsService: AccountsService,
  ) {}

  async createUser(
    data: CreateUserDto,
    user?: IReqUser,
  ): Promise<CreateUserDto> {
    const { email, phone_number, role } = data;
    const userDetailsExist = await this.userModel
      .query()
      .where((builder) => {
        builder.where('email', email).orWhere('phone_number', phone_number);
      })
      .first();

    if (userDetailsExist) {
      throw new HttpException(
        `user with email: ${email} or phone number:  ${phone_number} already exist`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (user?.role !== RolesEnum.ADMIN && role === RolesEnum.ADMIN) {
      throw new HttpException(
        'You are not authorized to create an admin, kindly login as an admin',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const generatedDemoId = await this.locationCounterService.generateDemoID(
      data.city.toLowerCase(),
      role,
    );
    const hashedPassword = await UtilService.hashPassword(data.password);
    const { otp, expiry } = UtilService.getOTP();

    const newUser: IUser = {
      ...data,
      password: hashedPassword,
      otp,
      otp_expiry: expiry,
      is_verified: false,
      demo_id: generatedDemoId,
    };

    const createdUser = await myTransaction(this.userModel, async (trx) => {
      return this.userModel.query(trx).insert(newUser);
    });
    await sendMail(
      email,
      `Kindly verify you email with the OTP below`,
      `Verify OTP`,
      `${otp}`,
    );
    if (createdUser) {
      const userAccount: CreateAccountDto = {
        account_name: `${data.first_name.toLowerCase()} ${data.last_name.toLowerCase()}`,
        account_number: UtilService.getAccountNumber(data.phone_number),
        bank_name: 'demo credit',
        user_id: createdUser.id,
      };
      await this.accountsService.createAccount(userAccount);
    }
    return createdUser;
  }

  async getAllUsers(queryParams: UserFilter) {
    const page = queryParams?.page ? Number(queryParams?.page) : 1;
    const size = queryParams?.size ? Number(queryParams.size) : 10;
    const query = await buildUserFilter(queryParams);

    const result = await this.userModel
      .query()
      .where(query)
      .orderBy('created_at', 'DESC')
      .page(page - 1, size);

    const totalPages = Math.ceil(result.total / size);

    return {
      users: result.results,
      pagination: {
        totalRows: result.total,
        perPage: size,
        currentPage: page,
        totalPages,
        hasNextPage: page < totalPages,
      },
    };
  }

  async getUserById(id: string): Promise<CreateUserDto> {
    const user = await this.userModel.query().findById(id);
    if (!user?.id) {
      throw new HttpException(
        `user with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async updateUserById(id: string, data: UpdateUserDto) {
    return myTransaction(this.userModel, async (trx) => {
      const updatedUser = await this.userModel
        .query(trx)
        .update(data)
        .where('id', id)
        .returning('*')
        .first();

      if (!updatedUser) {
        throw new HttpException(
          `User with id: ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedUser;
    });
  }

  async deleteUserById(id: string, user: IReqUser) {
    const userDetails = await this.userModel.query().findById(id);

    if (!userDetails) {
      throw new HttpException(
        `User with id: ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (user.role !== 'admin' && user.id !== userDetails.id) {
      throw new HttpException(
        'Unauthorized: You cannot delete another user',
        HttpStatus.UNAUTHORIZED,
      );
    }
    await this.userModel.query().deleteById(id);
  }
}
