import "./app/utils/environment.js";

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
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

app.listen(PORT, () => {
  console.log(`journeylog's API running on port ${PORT}.`);
});

routes(app);
