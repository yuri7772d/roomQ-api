const express = require("express");
const router = express.Router();
const authenUsecase = require("../../usecase/authen");
const { body } = require("express-validator");
const validatorError = require("../middlewere/validator");
const errExep = require("../../err.exeption");
const author = require("../middlewere/author");

router.post(
  "/",
  [
    body("username")
      .isString()
      .withMessage(errExep.NEED_TYPE_STRING)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
    body("password")
      .isString()
      .withMessage(errExep.NEED_TYPE_STRING)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
    body("roleID")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
  ],
  validatorError,
  author([0]),
  async (req, res) => {
    try {
      const { username, password, roleID } = req.body;
      const result = await authenUsecase.create(username, password, roleID);
      res.status(200).json(result.payload);
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);

router.post(
  "/login",
  [
    body("username")
      .isString()
      .withMessage(errExep.NEED_TYPE_STRING)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
    body("password")
      .isString()
      .withMessage(errExep.NEED_TYPE_STRING)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
  ],
  validatorError,
  async (req, res) => {
    try {
      const { username, password } = req.body;
      const result = await authenUsecase.login(username, password);

      res.cookie("token", result.token, {
        httpOnly: true, // ป้องกัน client script อ่าน cookie
        secure: false, // ใช้ true ถ้า https
        maxAge: 24 * 60 * 60 * 1000, // 1 วัน
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true, // ป้องกัน client script อ่าน cookie
        secure: false, // ใช้ true ถ้า https
        maxAge: 24 * 60 * 60 * 1000 * 7, // 7 วัน
      });

      res.status(200).json(result.payload);
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out" });
});

router.get("/refreshToken",
    async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.status(401).json({ message: "No token" });
    const result = await authenUsecase.refreshToken(refreshToken);

    res.cookie("token", result.token, {
      httpOnly: true, // ป้องกัน client script อ่าน cookie
      secure: false,
       // ใช้ true ถ้า https
      maxAge: 24 * 60 * 60 * 1000, // 1 วัน
    });

    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true, // ป้องกัน client script อ่าน cookie
      secure: false, // ใช้ true ถ้า https
      maxAge: 24 * 60 * 60 * 1000 * 7, // 7 วัน
    });

    res.status(200).json(result.payload);
  } catch (error) {
    res.status(400).json({ mesage: error.message });
  }
});

router.get("/token",
    async (req, res) => {
  try {
  
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token" });
   // console.log(token);
    
    const result = await authenUsecase.getPayloadByToken(token);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ mesage: error.message });
  }
});

router.get("/",
    author([0]),
    async (req, res) => {
  try {
    const result = await authenUsecase.listing();

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ mesage: error.message });
  }
});

router.delete(
  "/",
  [
    body("authenID")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
  ],
  author([0]),
  validatorError,
  async (req, res) => {
    try {
      const {authenID} = req.body 
      const result = await authenUsecase.delete(authenID);
      res.status(200).json({"authenID":authenID});
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);

module.exports = router;
