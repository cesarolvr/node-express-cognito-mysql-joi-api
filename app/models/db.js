// const mysql = require("mysql");
// const dbConfig = require("../config/db.config.js");
import mysql from "mysql";

// Config
import dbConfig from "../config/db.config.js";

const pool = mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
});

export default {
  getConnection: () => {
    return pool.getConnection(callback);
  },
};
