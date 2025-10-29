const express = require("express");
const router = express.Router();
const roomUsecase = require("../../usecase/room");
const validatorError = require("../middlewere/validator");
const errExep = require("../../err.exeption");
const author = require("../middlewere/author");

router.post(
  "/",
  [
    body("name")
      .isString()
      .withMessage(errExep.NEED_TYPE_STRING)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),

  ],
  validatorError,
  author([0]),
  async (req, res) => {
    try {
      const { name } = req.body;
      const result = await roomUsecase.create(name);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);

router.get("/listing",
    async (req, res) => {
  try {
    const result = await roomUsecase.listing();

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ mesage: error.message });
  }
});

router.delete(
  "/",
  [
    body("roomID")
      .isNumeric()
      .withMessage(errExep.NEED_TYPE_NUMBER)
      .notEmpty()
      .withMessage(errExep.IS_EMPTY),
  ],
  author([0]),
  validatorError,
  async (req, res) => {
    try {
      const {roomID} = req.body 
      const result = await roomUsecase.delete(roomID);
      res.status(200).json({"roomID":roomID});
    } catch (error) {
      res.status(400).json({ mesage: error.message });
    }
  }
);

module.exports = router;