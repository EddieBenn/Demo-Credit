import { Knex } from 'knex';
import {
  RolesEnum,
  GenderEnum,
  StatusEnum,
  TypeEnum,
} from '../src/base.entity';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary();
    table.string('firstName').notNullable();
    table.string('lastName').notNullable();
    table.string('phoneNumber').notNullable().unique();
    table.string('email').notNullable().unique();
    table.enum('role', Object.values(RolesEnum)).notNullable();
    table.string('password').notNullable();
    table.enum('gender', Object.values(GenderEnum)).notNullable();
    table.string('city').notNullable();
    table.string('photoUrl').notNullable();
    table.string('otp').nullable();
    table.timestamp('otpExpiry').nullable();
    table.boolean('isVerified').defaultTo(false);
    table.string('demoId').notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();
  });

  await knex.schema.createTable('accounts', (table) => {
    table.uuid('id').primary();
    table.string('accountName').notNullable();
    table.string('accountNumber').notNullable();
    table.decimal('accountBalance', 14, 2).notNullable();
    table.string('bankName').notNullable();
    table.uuid('userId').notNullable();
    table.foreign('userId').references('users.id').onDelete('CASCADE');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();
  });

  await knex.schema.createTable('locationCounter', (table) => {
    table.uuid('id').primary();
    table.string('city').notNullable();
    table.string('country').notNullable();
    table.integer('count').defaultTo(0);
    table.string('cityCode').notNullable();
    table.enum('role', Object.values(RolesEnum)).notNullable();
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();
    table.unique(['cityCode', 'role']);
  });

  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary();
    table.enum('type', Object.values(TypeEnum)).notNullable();
    table.enum('status', Object.values(StatusEnum)).notNullable();
    table.string('description').notNullable();
    table.decimal('amount', 14, 2).notNullable();
    table.uuid('senderAccountId').notNullable();
    table.string('senderName').notNullable();
    table.uuid('receiverAccountId').notNullable();
    table.string('receiverName').notNullable();
    table
      .foreign('senderAccountId')
      .references('accounts.id')
      .onDelete('CASCADE');
    table
      .foreign('receiverAccountId')
      .references('accounts.id')
      .onDelete('CASCADE');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
    table.timestamp('deletedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('transactions');
  await knex.schema.dropTableIfExists('locationCounter');
  await knex.schema.dropTableIfExists('accounts');
}
