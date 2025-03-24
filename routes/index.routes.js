const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.use('/towns', require('./towns.routes'))
router.use('/markets', require('./markets.routes'))
router.use('/users', require('./users.routes'))
router.use('/ai', require('./ai.routes'))

module.exports = router;
