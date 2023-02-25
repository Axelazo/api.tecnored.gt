import dotenv from "dotenv";
import { Options, Dialect } from "sequelize";

dotenv.config({ path: __dirname + "../../.env" });

const config: Options = {
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || undefined,
  database: process.env.DB_DATABASE || "tecnoredms",
  host: process.env.DB_HOST || "localhost",
  dialect: (process.env.DB_DIALECT as Dialect) || "mysql",
  logging: false,
};

export default config;

module.exports = config;
