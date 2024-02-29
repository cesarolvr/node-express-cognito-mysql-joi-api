import { Sequelize, Op, DataTypes } from "sequelize";

// Config
import dbConfig from "../config/db.config.js";

// Models
import Log from "./log/log.model.js";
import User from "./log/user.model.js";
import Plan from "./log/plan.model.js";
import Journey from "./log/journey.model.js";

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

try {
  await sequelize.authenticate();
  console.log(
    "Connection with journeylog's DB has been established successfully."
  );
} catch (error) {
  console.error("Unable to connect the journeylog's DB:", error);
}

const db = {};

db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = sequelize;

const LogObject = Log(sequelize, Sequelize, DataTypes);
const UserObject = User(sequelize, Sequelize, DataTypes);
const PlanObject = Plan(sequelize, Sequelize, DataTypes);
const JourneyObject = Journey(sequelize, Sequelize, DataTypes);

db.Logs = LogObject;
db.User = UserObject;
db.Plan = PlanObject;
db.Journey = JourneyObject;

UserObject.hasMany(JourneyObject);
JourneyObject.hasMany(LogObject);
PlanObject.hasMany(UserObject);

export default db;
