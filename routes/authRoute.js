const express = require("express");
const router = express.Router();
const { signUp, signIn } = require("../controllers/authController");

router.post("/register", signUp);
  
router.post("/login", signIn);

module.exports = router;