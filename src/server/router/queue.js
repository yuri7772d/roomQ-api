const express = require("express");
const router = express.Router();
const queueUsecase = require("../../usecase/queue");
const { body, query } = require("express-validator");
const validatorError = require("../middlewere/validator");
const errExep = require("../../err.exeption");
const author = require("../middlewere/author");
const toDate = require("../middlewere/todate.qry");
const todate = require("../middlewere/todate.qry");

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
  ],
  
 // toDate,
  author([1, 2]),
  async (req, res) => {
    try {
      const { reason, roomID} = req.body;
      const { date } = req.body;
      console.log(date)

      const authenID = req.payload.id
      const result = await queueUsecase.booking(reason, roomID, authenID, date);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);

router.put(
  "/approve",
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
    //  .toDate()
  ],
  todate,
  validatorError,
  author([0, 1]),
  async (req, res) => {
    try {
      const { queueID, roomID } = req.body;
      const {  date } = req;
      const result = await queueUsecase.approve(queueID, date, roomID);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);


router.get(
  "/listingAll",
  [
    query("year")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
    query("month")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
    query("roomID")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),

  ],
  validatorError,
  author([0, 1]),
  async (req, res) => {
    try {
      const { year, month, roomID } = req.query;
      const result = await queueUsecase.listingAll(year, month, roomID);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);

router.get(
  "/listingCurrent",
  [
    query("year")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
    query("month")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
    query("roomID")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),

  ],
  validatorError,
  author([2]),
  async (req, res) => {
    try {
      const { year, month, roomID } = req.query;
      const result = await queueUsecase.listingCurrent(year, month, roomID);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);


router.get(
  "/getAllByDate",
  [
    query("roomID")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
    query("date")
      .isISO8601()
      .withMessage(errExep.DATE_INVALID)


  ],
  toDate,
  validatorError,
  author([0, 1]),
  async (req, res) => {
    try {
      const { roomID } = req.query;
      const {date} =req
      
      const result = await queueUsecase.getAllByDate(date, roomID);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);

router.get(
  "/getCurrentByID",
  [
    query("queueID")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
  ],
  validatorError,
  author([2]),
  async (req, res) => {
    try {
      const { queueID } = req.query;
      const result = await queueUsecase.getCurrentByID(queueID);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);


module.exports = router;
