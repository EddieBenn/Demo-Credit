import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  CreateUserDto,
  ForgotPasswordDto,
  IUser,
  LoginDto,
  UserFilter,
  VerifyOtpDto,
} from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ModelClass } from 'objection';
import { LocationCounterService } from 'src/location-counter/location-counter.service';
import { UtilService } from 'src/utils/utility-service';
import { myTransaction } from 'src/utils/transaction';
import { sendMail } from 'src/utils/nodemailer';
import { IReqUser, RolesEnum } from '../base.entity';
import { buildUserFilter } from 'src/filters/query-filter';
import { CreateAccountDto } from 'src/accounts/dto/create-account.dto';
import { AccountsService } from 'src/accounts/accounts.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import moment from 'moment';
import { AuthService } from 'src/auth/auth.service';
import { checkKarmaList } from 'src/utils/check-karma';

@Injectable()
export class UsersService {
  constructor(
    @Inject('User')
    private readonly userModel: ModelClass<User>,
    private readonly locationCounterService: LocationCounterService,
    private readonly accountsService: AccountsService,
    private configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  async createUser(
    data: CreateUserDto,
    user?: IReqUser,
  ): Promise<CreateUserDto> {
    const { email, phoneNumber, role } = data;

    const karmaCheck = await checkKarmaList(email);
    if (karmaCheck?.data?.karma_identity) {
      throw new HttpException(
        `User with email ${email} is on the Karma blacklist for ${karmaCheck?.data?.karma_type?.karma}`,
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const userDetailsExist = await this.userModel
      .query()
      .where((builder) => {
        builder.where('email', email).orWhere('phoneNumber', phoneNumber);
      })
      .first();

    if (userDetailsExist) {
      throw new HttpException(
        `user with email: ${email} or phone number:  ${phoneNumber} already exist`,
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
      otpExpiry: expiry,
      isVerified: false,
      demoId: generatedDemoId,
    };

    const createdUser = await myTransaction(this.userModel, async (trx) => {
      return this.userModel.query(trx).insert(newUser);
    });
    await sendMail(
      email,
      `Kindly verify your email with the OTP below`,
      `Verify OTP`,
      `${otp}`,
    );
    if (createdUser) {
      const userAccount: CreateAccountDto = {
        accountName: `${data.firstName.toLowerCase()} ${data.lastName.toLowerCase()}`,
        accountNumber: UtilService.getAccountNumber(data.phoneNumber),
        bankName: 'demo credit',
        userId: createdUser.id,
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
      .orderBy('createdAt', 'DESC')
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
    await this.accountsService.deleteAccountByUserId(id);
  }

  async forgotPassword(data: ForgotPasswordDto, res: Response) {
    const user = await this.userModel
      .query()
      .where({ email: data.email })
      .first();

    if (!user?.id) {
      throw new HttpException(
        `User with email: ${data.email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    const { otp, expiry } = UtilService.getOTP();
    await this.userModel
      .query()
      .patch({ otp, otpExpiry: expiry })
      .where({ email: data.email });

    await sendMail(
      data.email,
      `Kindly use this OTP to reset your password`,
      'Reset Password OTP',
      `${otp}`,
    );

    return res.status(HttpStatus.OK).json({
      message: 'OTP has been sent to your email for password reset',
    });
  }

  async verifyOTP(data: VerifyOtpDto, res: Response) {
    const user = await this.userModel
      .query()
      .where({ email: data.email })
      .first();

    if (!user?.id) {
      throw new HttpException(
        `User with email: ${data.email} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (
      user.otp !== data.otp ||
      Date.now() > new Date(user.otpExpiry).getTime()
    ) {
      throw new HttpException(
        'OTP is invalid or expired, try logging in to get a new OTP',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (data.newPassword) {
      const hashedPassword = await UtilService.hashPassword(data.newPassword);
      await this.userModel
        .query()
        .patch({ password: hashedPassword, otp: null, otpExpiry: null })
        .where({ email: data.email });

      return res.status(HttpStatus.OK).json({
        message: 'Password reset successful',
      });
    } else {
      await this.userModel
        .query()
        .patch({ isVerified: true, otp: null, otpExpiry: null })
        .where({ email: data.email });

      return res.status(HttpStatus.OK).json({
        message: 'User verified successfully',
      });
    }
  }

  async loginUser(data: LoginDto, res: Response) {
    const { email, password } = data;
    const user = await this.userModel.query().where({ email }).first();

    if (!user?.id) {
      throw new NotFoundException(`User with email: ${email} not found`);
    }
    if (!user.isVerified) {
      const currentTime = new Date();
      const otpExpiryTime = new Date(user.otpExpiry);

      if (currentTime > otpExpiryTime) {
        const { otp, expiry } = UtilService.getOTP();
        await this.userModel
          .query()
          .patch({ otp, otpExpiry: expiry })
          .where({ email });

        await sendMail(
          email,
          `Kindly verify your email with the OTP below`,
          `Verify OTP`,
          `${otp}`,
        );

        throw new HttpException(
          {
            status: HttpStatus.FORBIDDEN,
            error: `A new OTP has been sent to your email. Please verify your account with the new OTP.`,
          },
          HttpStatus.FORBIDDEN,
        );
      }

      // throw error if the OTP is still valid but the user is not verified
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: `Your email is not verified. Please verify with the OTP sent to your email.`,
        },
        HttpStatus.FORBIDDEN,
      );
    }
    const isPasswordValid = await UtilService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const tokenData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      city: user.city,
      role: user.role,
      photoUrl: user.photoUrl,
      demoId: user.demoId,
      isVerified: user.isVerified,
    };

    const access_token = await this.authService.generateToken(tokenData);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      expires: moment().add(1, 'hour').toDate(),
      sameSite: 'strict',
    });

    return res.status(HttpStatus.OK).json({
      user,
      access_token,
      expiresAt: moment().add(1, 'hour').format(),
    });
  }

  async logoutUser(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'strict',
    });

    return res.status(HttpStatus.OK).json({
      message: 'Logout successful',
    });
  }
}
