const express = require("express");
const { registerUser, authUser } = require("../controllers/userControllers.js");
const router = express.Router();

// first way to wright route - this way we can  chain functions to same route
router.route("/").post(registerUser);

// second way to wright route - this way we can not chain functions to same route
router.post("/login", authUser);

module.exports = router;
