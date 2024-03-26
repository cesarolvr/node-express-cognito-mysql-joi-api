import jwt from "jsonwebtoken";
import redis from "redis";

export const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  

  jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
    if (err) {
      res
        .status(403)
        .send({
          message: "Invalid token",
        })
        .end();
      return;
    }

    req.userInfo = userInfo;
    next();
  });
};
