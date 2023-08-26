const express = require("express");
const router = express.Router();

const Controllers = require("../controllers");
const Auth = Controllers.Auth;

router.post("/login", Auth.Login);
router.post("/sign-up", Auth.SignUp);

module.exports = router;
