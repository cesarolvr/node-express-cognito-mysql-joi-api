import { Sequelize, Op, DataTypes } from "sequelize";

// Models
import Log from "./log.model.js";
import User from "./user.model.js";
import Plan from "./plan.model.js";
import Journey from "./journey.model.js";

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

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

const UserObject = User(sequelize, Sequelize, DataTypes);
const PlanObject = Plan(sequelize, Sequelize, DataTypes);
const JourneyObject = Journey(sequelize, Sequelize, DataTypes);
const LogObject = Log(sequelize, Sequelize, DataTypes);

db.User = UserObject;
db.Plan = PlanObject;
db.Journey = JourneyObject;
db.Log = LogObject;

UserObject.hasMany(JourneyObject, {
  foreignKey: "userId",
});

PlanObject.hasMany(UserObject, {
  foreignKey: "planId",
});

JourneyObject.hasMany(LogObject, {
  foreignKey: "journeyId",
});

export default db;
