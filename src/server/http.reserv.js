
const express = require("express");
const app = express();
const { server } = require("../config.load");
const healthCheck = require("./default.router");
const cookieParser  =require("cookie-parser");


exports.start = () => {

  app.use(express.json());
  app.use(cookieParser());

  app.get("/", healthCheck);

  app.listen(server.port, () => {
    console.log(`Example app listening on port ${server.port}`);
  });
};