# Demo Credit

## Project Overview
Demo Credit is a RESTful API built using **Node.js**, **NestJS**, **Knex.js**, and **Objection.js** for managing a fintech platform. The API allows users to register, create accounts, fund accounts via Paystack API, withdraw from accounts, and transfer funds to other users. It also includes an authentication module (JWT) for managing user authentication and authorization. The backend integrates image uploading via Cloudinary during customer creation and supports basic CRUD operations for users, accounts, transactions, and location counters. Swagger is integrated for easy API testing. Add `/documentationView` to the base URL to access the Swagger documentation.

## Features
- **User Authentication**: Register, login, reset password, and verify emails via OTP.
- **Accounts**: Create, read, update, and delete accounts.
- **Transactions**: Add, fetch, update, and delete transactions.
- **Location Counter**: Create, read, update, delete, and generate demo credit IDs.
- **Profile Management**: View and update user profiles.

## Table of Contents
1. [Installation](#installation)
2. [Environment Variables](#environment-variables)
3. [Project Structure](#project-structure)
4. [API Routes](#api-routes)
    - [User Routes](#user-routes)
    - [Account Routes](#account-routes)
    - [Transaction Routes](#transaction-routes)
    - [Location Counter Routes](#location-counter-routes)
5. [Technologies Used](#technologies-used)

## Installation
To install and run the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/EddieBenn/Demo-Credit.git
Navigate into the project directory:
bash
Copy code
cd Demo-Credit
Install dependencies:
bash
Copy code
npm install
Create a .env file in the root directory and add the necessary environment variables (see the Environment Variables section).
Build the project:
bash
Copy code
npm run build
Start the development server:
bash
Copy code
npm run start
Environment Variables
Create a .env file in the root directory with the following variables:

bash
Copy code
# DEVELOPMENT KEYS
PORT=YOUR_PORT
JWT_SECRET=YOUR_JWT_SECRET
JWT_EXPIRY=YOUR_JWT_EXPIRY
PAYSTACK_SECRET_KEY=YOUR_PAYSTACK_SECRET_KEY
ADJUTOR_SECRET_KEY=YOUR_ADJUTOR_SECRET_KEY
ADJUTOR_KARMA_URL=YOUR_ADJUTOR_KARMA_URL

# CLOUDINARY KEYS
CLOUDINARY_NAME=YOUR_CLOUDINARY_NAME
API_KEY=YOUR_API_KEY
API_SECRET=YOUR_API_SECRET

# DATABASE KEYS
PROD_PORT=YOUR_PROD_PORT
PROD_DB_NAME=YOUR_PROD_DB_NAME
PROD_DB_USERNAME=YOUR_PROD_DB_USERNAME
PROD_DB_PASSWORD=YOUR_PROD_DB_PASSWORD
PROD_DB_HOST=YOUR_PROD_DB_HOST

# GMAIL SMTP KEYS FOR MAILS
GMAIL_USER=YOUR_GMAIL_USER
GMAIL_PASSWORD=YOUR_GMAIL_PASSWORD
Project Structure
bash
Copy code
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
API Routes
User Routes
HTTP Method	Endpoint	Description
POST	/users/	Register a new user (requires profile image)
POST	/users/verify-otp	Verify user email using OTP
POST	/users/login	Log in a user
GET	/users/
Get details of a user (requires auth and user_id)
GET	/users	Get all users (requires auth)
PUT	/users/
Update a user (requires auth and user_id)
DELETE	/users/
Delete a user (requires auth and user_id; admin-only for others)
POST	/users/forgot-password	Reset the password of a user
Account Routes
All routes in this module require authentication.

HTTP Method	Endpoint	Description
POST	/accounts	Create a new account
GET	/accounts	Get all accounts (admin-only)
GET	/accounts/
Get one account
GET	/accounts/user/
Get an account by user_id
PUT	/accounts/
Update account
DELETE	/accounts/
Delete an account
Transaction Routes
All routes in this module require authentication.

HTTP Method	Endpoint	Description
POST	/transactions	Create a new transaction
GET	/transactions	Get all transactions (admin-only)
GET	/transactions/
Get one transaction
GET	/transactions/account/
Get transactions by account_id
PUT	/transactions/
Update transaction
PUT	/transactions/status/update	Update transaction status
DELETE	/transactions/
Delete a transaction
Location Counter Routes
Only admins can access these routes, and all require authentication.

HTTP Method	Endpoint	Description
POST	/location-counter	Create a location counter
GET	/location-counter	Get all location counters
GET	/location-counter/
Get one location counter
PUT	/location-counter/
Update a location counter
DELETE	/location-counter/
Delete a location counter
Technologies Used
Node.js
NestJS
TypeScript
Knex.js (for MySQL)
Objection.js (for ORM)
Cloudinary (for image uploads)
Multer (for file uploads)
JWT (for authentication)
Bcrypt (for password hashing)
Nodemailer (for email verification)
Paystack (for payment processing)
Jest (for unit testing)
Swagger (for API documentation and testing)
Otp-generator (for OTP generation)
Moment (for date and time formatting)
Class-validator & Class-transformer (for input validation)