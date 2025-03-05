const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use('/towns', require('./towns.routes'))

module.exports = router;
