import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('accounts', (table) => {
    table.decimal('accountBalance', 14, 2).notNullable().defaultTo(0).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('accounts', (table) => {
    table.decimal('accountBalance', 14, 2).notNullable().alter();
  });
}
