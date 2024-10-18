import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { HttpException, HttpStatus } from '@nestjs/common';

dotenv.config();

const { GMAIL_USER, GMAIL_PASSWORD } = process.env;

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: `${GMAIL_USER}`,
    pass: `${GMAIL_PASSWORD}`,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendMail = async (
  to: string,
  message: string,
  subject: string,
  actionLink?: string,
  actionText?: string,
) => {
  try {
    const mailOptions = {
      from: `${GMAIL_USER}`,
      to,
      subject,
      html: `<div style="text-align: center; padding: 25px; border-radius: 5px; border: 2px solid #27AE60;">
              <h1>Welcome to Made In Naija Stores</h1>
              <p>${message}</p>
              ${actionLink ? `<a href="${actionLink}" style="text-decoration: none; color: white; display: inline-block; background-color: #27AE60; padding: 10px 20px; border-radius: 10px;">${actionText}</a>` : ''}
             </div>`,
    };

    const response = await transport.sendMail(mailOptions);
    return response;
  } catch (err: any) {
    console.error('Error sending email:', err.message);
    throw new HttpException(err.message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
};

export default {
  sendMail,
};
