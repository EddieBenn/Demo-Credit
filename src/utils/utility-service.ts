import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import otpGenerator from 'otp-generator';
import moment from 'moment';

class UtilityService {
  hashPassword = async (password: string) => {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };

  generatePassword = (last_name: string): string => {
    const capitalizedLastName =
      last_name.charAt(0).toUpperCase() + last_name.slice(1);
    const randomNumber = Math.floor(1000 + Math.random() * 90000);
    const specialCharacters = '!@$%&*?';

    const randomSpecialChar = specialCharacters.charAt(
      Math.floor(Math.random() * specialCharacters.length),
    );
    const newPassword = `${capitalizedLastName}${randomNumber}${randomSpecialChar}`;
    return newPassword;
  };

  validatePassword = (password: string, hashedPassword: string) => {
    return bcrypt.compare(password, hashedPassword);
  };

  getUUID() {
    return uuidv4();
  }

  getOTP() {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const expiry = moment().add(30, 'minutes').toDate();
    return {
      otp,
      expiry,
    };
  }

  getAccountNumber(phoneNumber: string): string {
    if (phoneNumber.startsWith('+234')) {
      return phoneNumber.slice(4);
    }
    if (phoneNumber.startsWith('0')) {
      return phoneNumber.slice(1);
    }
    return phoneNumber;
  }
}

export const UtilService = new UtilityService();
