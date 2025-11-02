const express = require("express");
const app = express();
const { server } = require("../config.load");
const healthCheck = require("./default.router");
const cookieParser = require("cookie-parser");
const authenRouter = require("./router/authen");
const queueRouter = require("./router/queue");
const roomRouter = require("./router/room");
const cors = require("cors"); // ✅ import cors

exports.start = () => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
    origin: "http://localhost:3000", // frontend ของคุณ
    credentials: true,               // ต้องมี เพื่อให้ cookie ส่งได้
  })
  );

  app.get("/", healthCheck);
  app.use("/authen", authenRouter);
  app.use("/queue", queueRouter);
  app.use("/room", roomRouter);
  app.listen(server.port, () => {
    console.log(`Example app listening on port ${server.port}`);
  });
};
