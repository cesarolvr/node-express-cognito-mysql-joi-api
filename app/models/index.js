import { Sequelize, Op, DataTypes } from "sequelize";

// Config
import dbConfig from "../config/db.config.js";

// Models
import Log from "./log/log.model.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = sequelize;

db.Logs = Log(sequelize, Sequelize, DataTypes);

export default db;
