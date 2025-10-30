const express = require("express");
const router = express.Router();
const queueUsecase = require("../../usecase/queue");
const { body } = require("express-validator");
const validatorError = require("../middlewere/validator");
const errExep = require("../../err.exeption");
const author = require("../middlewere/author");

router.post(
  "/booking",
  [
    body("reason")
      .isString()
      .withMessage(errExep.NEED_TYPE_STRING)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
    body("roomID")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
    body("date")
      .isISO8601()
      .withMessage(errExep.DATE_INVALID)
      .toDate()
    //.notEmpty()
    //.withMessage(errExep.IS_EMPTY), // แปลงเป็น Date object อัตโนมัติ
  ],
  validatorError,
  author([1,2]),
  async (req, res) => {
    try {
      const { reason, roomID, date } = req.body;
      const authenID = req.payload.id
      const result = await queueUsecase.booking(reason, roomID, authenID, date);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);

router.post(
  "/appove",
  [
    body("queueID")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
    body("roomID")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
    body("date")
      .isISO8601()
      .withMessage(errExep.DATE_INVALID)
      .toDate()
    //.notEmpty()
    //.withMessage(errExep.IS_EMPTY), // แปลงเป็น Date object อัตโนมัติ
  ],
  validatorError,
  author([0,1]),
  async (req, res) => {
    try {
      const { reason, roomID, date } = req.body;
      const result = await queueUsecase.approve(queueID, date, roomID);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);




module.exports = router;
