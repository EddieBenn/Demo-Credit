import * as dotenv from 'dotenv';

dotenv.config();

const {
  PROD_PORT,
  PROD_DB_NAME,
  PROD_DB_HOST,
  PROD_DB_PASSWORD,
  PROD_DB_USERNAME,
} = process.env;

const knexConfig = {
  client: 'mysql2',
  connection: {
    host: PROD_DB_HOST,
    port: Number(PROD_PORT),
    user: PROD_DB_USERNAME,
    password: PROD_DB_PASSWORD,
    database: PROD_DB_NAME,
  },
  migrations: {
    directory: './migrations',
    tableName: 'knex_migrations',
  },
  pool: { min: 2, max: 10 },
  useNullAsDefault: true,
};

export default knexConfig;

module.exports = knexConfig;
