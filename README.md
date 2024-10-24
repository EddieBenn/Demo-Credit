# Demo Credit

[Demo-Credit-Url](https://edidiong-ndaobong-lendsqr-be-test.onrender.com)

## Project Overview
Demo Credit is a RESTful API built using **Node.js**, **NestJS**, **Knex.js**, and **Objection.js** for managing a fintech platform. The API allows users to register, create accounts, fund accounts via Paystack API, withdraw from accounts, and transfer funds to other users. It also includes an authentication module (JWT) for managing user authentication and authorization. The backend integrates image uploading via Cloudinary during customer creation and supports basic CRUD operations for users, accounts, transactions, and location counters. Swagger is integrated for easy API testing. Add `/documentationView` to the base URL to access the Swagger documentation.

## Features
- **User Authentication**: Register, login, reset password, and verify emails via OTP.
- **Accounts**: Create, read, update, and delete accounts.
- **Transactions**: Add, fetch, update, and delete transactions.
- **Location Counter**: Create, read, update, delete, and generate demo credit IDs.
- **Profile Management**: View and update user profiles.

## ERD
![demo-credit-ERD](https://github.com/user-attachments/assets/75e60781-4e9b-43ed-82d2-aea21a52acec)

## Table of Contents
Installation<br />
Environment Variables<br />
Project Structure<br />
API Routes<br />
User Routes<br />
Account Routes<br />
Transaction Routes<br />
Location Counter Routes<br />
Payment Routes<br />
Technologies Used<br />


## Installation
To install and run the project locally:

#### Clone the repository:

``` 
git clone https://github.com/EddieBenn/Demo-Credit.git
```
#### Navigate into the project directory:

```
cd Demo-Credit
```

#### Install dependencies:

```
npm install
```

#### Create a .env file in the root directory and add the necessary environment variables (see the Environment Variables section).


#### Build the project

```
npm run build
```


#### Start the development server:

```
npm run start
```

# Environment Variables
Create a .env file in the root directory with the following variables:

```
# DEVELOPMENT KEYS
PORT = YOUR PORT
JWT_SECRET = YOUR JWT_SECRET
JWT_EXPIRY = YOUR JWT_EXPIRY
PAYSTACK_SECRET_KEY = YOUR PAYSTACK_SECRET_KEY
ADJUTOR_SECRET_KEY = YOUR ADJUTOR_SECRET_KEY
ADJUTOR_KARMA_URL = YOUR ADJUTOR_KARMA_URL

# CLOUDINARY KEYS
CLOUDINARY_NAME = YOUR CLOUDINARY_NAME
API_KEY = YOUR API_KEY
API_SECRET = YOUR API_SECRET

# DATABASE KEYS
PROD_PORT = YOUR PROD_PORT
PROD_DB_NAME = YOUR PROD_DB_NAME
PROD_DB_USERNAME = YOUR PROD_DB_USERNAME
PROD_DB_PASSWORD = YOUR PROD_DB_PASSWORD
PROD_DB_HOST = YOUR PROD_DB_HOST

# GMAIL SMTP KEYS FOR MAILS
GMAIL_USER = YOUR GMAIL_USER
GMAIL_PASSWORD = YOUR GMAIL_PASSWORD
APP_BASE_URL = YOUR APP_BASE_URL
```


# Project Structure

```
├── migrations
├── src
│   ├── accounts
│   ├── auth
│   ├── filters
│   ├── location-counter
│   ├── payments
│   ├── transactions
│   ├── users
│   ├── utils
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── base.entity.ts
│   ├── database.module.ts
│   └── main.ts
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── knexfile.ts
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.json
└── tsconfig.build.json
```


## API Routes
#### User Routes

<table> <thead> <tr> <th>HTTP Method</th> <th>Endpoint</th> <th>Description</th> </tr> </thead> <tbody> <tr> <td>POST</td> <td>/users</td> <td>Register a new user (requires profile image)</td> </tr> <tr> <td>POST</td> <td>/users/verify-otp</td> <td>Verify user email using OTP</td> </tr> <tr> <td>POST</td> <td>/users/login</td> <td>Log in a user</td> </tr> <tr> <td>GET</td> <td>/users/:id</td> <td>Get details of a user (requires auth and user_id)</td> </tr> <tr> <td>GET</td> <td>/users</td> <td>Get all users (requires auth)</td> </tr> <tr> <td>PUT</td> <td>/users/:id</td> <td>Update a user (requires auth and user_id)</td> </tr> <tr> <td>DELETE</td> <td>/users/:id</td> <td>Delete a user (requires auth and user_id; admin-only for others)</td> </tr> <tr> <td>POST</td> <td>/users/forgot-password</td> <td>Reset the password of a user</td> </tr> </tbody> </table>



#### Account Routes
All routes in this module require authentication

<table> <thead> <tr> <th>HTTP Method</th> <th>Endpoint</th> <th>Description</th> </tr> </thead> <tbody> <tr> <td>POST</td> <td>/accounts</td> <td>Create a new account</td> </tr> <tr> <td>GET</td> <td>/accounts</td> <td>Get all accounts (admin-only)</td> </tr> <tr> <td>GET</td> <td>/accounts/:id</td> <td>Get one account</td> </tr> <tr> <td>GET</td> <td>/accounts/user/::userId</td> <td>Get an account by user_id</td> </tr> <tr> <td>PUT</td> <td>/accounts/:id</td> <td>Update account</td> </tr> <tr> <td>DELETE</td> <td>/accounts/:id</td> <td>Delete an account</td> </tr> </tbody> </table>


#### Transaction Routes
All routes in this module require authentication

<table> <thead> <tr> <th>HTTP Method</th> <th>Endpoint</th> <th>Description</th> </tr> </thead> <tbody> <tr> <td>POST</td> <td>/transactions</td> <td>Create a new transaction</td> </tr> <tr> <td>GET</td> <td>/transactions</td> <td>Get all transactions (admin-only)</td> </tr> <tr> <td>GET</td> <td>/transactions/:id</td> <td>Get one transaction</td> </tr> <tr> <td>GET</td> <td>/transactions/account/:accountId</td> <td>Get transactions by account_id</td> </tr> <tr> <td>PUT</td> <td>/transactions/:id</td> <td>Update transaction</td> </tr> <tr> <td>PUT</td> <td>/transactions/status/update</td> <td>Update transaction status</td> </tr> <tr> <td>DELETE</td> <td>/transactions/:id</td> <td>Delete a transaction</td> </tr> </tbody> </table>


#### Location Counter Routes
Only admins can access these routes, and all require authentication


<table> <thead> <tr> <th>HTTP Method</th> <th>Endpoint</th> <th>Description</th> </tr> </thead> <tbody> <tr> <td>POST</td> <td>/location-counter</td> <td>Create a location counter</td> </tr> <tr> <td>GET</td> <td>/location-counter</td> <td>Get all location counters</td> </tr> <tr> <td>GET</td> <td>/location-counter/:id</td> <td>Get one location counter</td> </tr> <tr> <td>PUT</td> <td>/location-counter/:id</td> <td>Update a location counter</td> </tr> <tr> <td>DELETE</td> <td>/location-counter/:id</td> <td>Delete a location counter</td> </tr> </tbody> </table>


#### Payment Routes
All the routes in this module require authentication


<table>
  <thead>
    <tr>
      <th>HTTP Method</th>
      <th>Endpoint</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>POST</td>
      <td>/payments/initialize/paystack</td>
      <td>Initiate a transaction</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/payments/verify/:reference</td>
      <td>Verify a transaction</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/payments/webhook/paystack</td>
      <td>Fulfil payment webhook</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/payments/transfer-recipient/paystack</td>
      <td>Initiate a transfer recipient</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/payments/initiate-transfer/paystack</td>
      <td>Initiate a transfer</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/payments/confirm-transfer</td>
      <td>Confirm a transfer</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/payments/verify-transfer/:reference</td>
      <td>Verify a transfer</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/payments/transfer</td>
      <td>In-app transfer to another user</td>
    </tr>
    <tr>
      <td>GET</td>
      <td>/payments/customers/paystack</td>
      <td>Get customer list on Paystack</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/payments/customer/get-one/:email</td>
      <td>Get one customer on Paystack</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/payments/create-customer/paystack</td>
      <td>Create customer on Paystack</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>/payments/create/virtual-account/:customerCode</td>
      <td>Create dedicated virtual account on Paystack</td>
    </tr>
  </tbody>
</table>


## Technologies Used

<ul>
<li>
Node.js
</li>
<li>
NestJS
</li>
<li>
TypeScript
</li>
<li>
Knex.js (for MySQL)
</li>
<li>
Objection.js (for ORM)
</li>
<li>
Cloudinary (for image uploads)
</li>
<li>
Multer (for file uploads)
</li>
<li>
JWT (for user authentication)
</li>
<li>
Bcrypt (for password hashing)
</li>
<li>
Nodemailer (for sending verification emails)
</li>
<li>
Paystack (for payment processing)
</li>
<li>
Jest (for unit testing)
</li>
<li>
Swagger (for API documentation and testing)
</li>
<li>
Otp-generator (for OTP generation)
</li>
<li>
Moment (for date and time formatting)
</li>
<li>
Class-validator & Class-transformer (for input validation)
</li>
</ul>
