import type { Knex } from 'knex';
import { StatusEnum, TypeEnum } from '../src/base.entity';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('location_counter', (table) => {
    table.unique(['city_code', 'role']);
  });

  // Create accounts table
  await knex.schema.createTable('accounts', (table) => {
    table.uuid('id').primary();
    table.string('account_name').notNullable();
    table.string('account_number').unique().notNullable();
    table.decimal('account_balance', 14).defaultTo(0).notNullable();
    table.string('bank_name').notNullable();
    table.uuid('user_id').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
  });

  // Create transactions table
  await knex.schema.createTable('transactions', (table) => {
    table.uuid('id').primary();
    table.enum('type', Object.values(TypeEnum)).notNullable();
    table.enum('status', Object.values(StatusEnum)).notNullable();
    table.string('description').nullable();
    table.decimal('amount', 14).notNullable();
    table
      .uuid('sender_account_id')
      .references('id')
      .inTable('accounts')
      .onDelete('CASCADE');
    table.string('sender_name').notNullable();
    table
      .uuid('receiver_account_id')
      .references('id')
      .inTable('accounts')
      .onDelete('CASCADE');
    table.string('receiver_name').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  // Drop transactions table
  await knex.schema.dropTableIfExists('transactions');

  // Drop accounts table
  await knex.schema.dropTableIfExists('accounts');

  // Revert unique constraint on location_counter
  await knex.schema.alterTable('location_counter', (table) => {
    table.dropUnique(['city_code', 'role']);
  });
}
