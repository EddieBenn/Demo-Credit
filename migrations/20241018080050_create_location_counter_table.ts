import type { Knex } from 'knex';
import { RolesEnum } from '../src/base.entity';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('location_counter', (table) => {
    table.uuid('id').primary();
    table.string('city').notNullable();
    table.string('country').notNullable();
    table.integer('count').defaultTo(0);
    table.string('city_code').notNullable();
    table.enum('role', Object.values(RolesEnum)).notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('location_counter');
}
