import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.uuid('sender_account_id').notNullable().alter();
    table.uuid('receiver_account_id').notNullable().alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.uuid('sender_account_id').nullable().alter();
    table.uuid('receiver_account_id').nullable().alter();
  });
}
