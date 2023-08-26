const express = require("express");
const router = express.Router();
const Controllers = require("../controllers");
const wallet = Controllers.Wallet;

router.post("/get-amount", wallet.GetBalance);
router.post("/insert-amount", wallet.InsertBalance);

module.exports = router;
