import "./app/utils/environment.js";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import redis from "redis";
import RedisStore from "connect-redis";
import session from "express-session";
import routes from "./app/routes/routes.js";
import db from "./app/models/index.js";

const app = express();

var corsOptions = {
  origin: process.env.API,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = 8080;

// Database
db.sequelize.sync({
  // force: true
});

const redisClient = redis
  .createClient({
    url: "redis://localhost",
    port: 6379,
  })
  .on("error", (err) => console.log("Redis client error", err))
  .on("ready", (connection) => {
    console.log(
      "Connection with journeylog's Redis has been established successfully."
    );
    return connection;
  })
  .connect();

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.REDIS_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie
      maxAge: 1000 * 60 * 10, // session max age in miliseconds
    },
  })
);

app.listen(PORT, () => {
  console.log(`journeylog's API running on port ${PORT}.`);
});

routes(app);
