import { Knex } from 'knex';
import { SourceEnum } from '../src/base.entity';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.string('senderName').nullable().alter();
    table.uuid('receiverAccountId').nullable().alter();
    table.string('receiverName').nullable().alter();
    table.uuid('senderAccountId').nullable().alter();
    table.enum('source', Object.values(SourceEnum)).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('transactions', (table) => {
    table.string('senderName').notNullable().alter();
    table.uuid('receiverAccountId').notNullable().alter();
    table.uuid('senderAccountId').notNullable().alter();
    table.string('receiverName').notNullable().alter();
    table.dropColumn('source');
  });
}
