import { Global, Module } from '@nestjs/common';
import Knex from 'knex';
import { knexSnakeCaseMappers, Model } from 'objection';
import { LocationCounter } from './location-counter/entities/location-counter.entity';

const models = [LocationCounter];

const modelProviders = models.map((model) => ({
  provide: model.name,
  useValue: model,
}));

const providers = [
  ...modelProviders,
  {
    provide: 'KnexConnection',
    useFactory: async () => {
      const knex = Knex({
        client: 'mysql2',
        connection: {
          host: process.env.PROD_DB_HOST,
          port: Number(process.env.PROD_PORT),
          user: process.env.PROD_DB_USERNAME,
          password: process.env.PROD_DB_PASSWORD,
          database: process.env.PROD_DB_NAME,
        },
        pool: { min: 2, max: 10 },
        useNullAsDefault: true,
        ...knexSnakeCaseMappers(),
      });

      Model.knex(knex);
      return knex;
    },
  },
];

@Global()
@Module({
  providers: [...providers],
  exports: [...providers],
})
export class DatabaseModule {}
