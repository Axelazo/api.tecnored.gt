import { Sequelize } from "sequelize";
import config from "../config/config";

const sequelize = config.host
  ? new Sequelize(
      config.database ?? "admontecnored",
      config.username ?? "root",
      config.password ?? "",
      config
    )
  : new Sequelize(
      config.database ?? "admontecnored",
      config.username ?? "root",
      config.password ?? "",
      config
    );

export { Sequelize, sequelize };
