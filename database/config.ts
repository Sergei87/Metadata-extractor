export default {
  database: 'postgres',
  host: 'localhost',
  logging: false,
  username: 'postgres',
  password: 'plaintextpassword',
  port: '5432',
  synchronize: false,
  type: 'postgres',
  entities: [`/models/**/*.ts`],
  migrations: ['./migrations/**/*.ts'],
  cli: {
    migrationsDir: './database/migrations',
  },
};
