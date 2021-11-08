const paths = {
  development: '.env',
  test: '.env.test',
  prod: './.env.prod'
}
const env = process.env.NODE_ENV || 'development'

require('dotenv').config({ path: paths[env] })

const DB_USERNAME = process.env.DB_USERNAME || "postgres";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_NAME = process.env.DB_NAME || "jsl-postgres";
const DB_PWD = process.env.DB_PWD || "postgres";
const DB_PORT = process.env.DB_PORT || 5432;

module.exports = {
  development: {
    username: DB_USERNAME,
    port: DB_PORT,
    password: DB_PWD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false,
      // },
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  test: {
    port: DB_PORT,
    username: DB_USERNAME,
    password: DB_PWD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
  production: {
    port: DB_PORT,
    use_env_variable: "DATABASE_URL",
    dialect: "postgres",
    protocol: "postgres",
    url: process.env.DATABASE_URL,
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      // paranoid: true,
      // timestamps: true
    },
    timezone: process.env.TZ || "America/Sao_Paulo",
  },
};
