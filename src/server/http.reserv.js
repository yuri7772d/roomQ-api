const express = require("express");
const app = express();
const { server } = require("../config.load");
const healthCheck = require("./default.router");
const cookieParser = require("cookie-parser");
const authenRouter = require("./router/authen");
const roomRouter = require("./router/room");

exports.start = () => {
  app.use(express.json());
  app.use(cookieParser());

  app.get("/", healthCheck);
  app.use("/authen", authenRouter);
  app.use("/room", roomRouter);
  app.listen(server.port, () => {
    console.log(`Example app listening on port ${server.port}`);
  });
};
