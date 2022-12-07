const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers.js");
const { protect } = require("../middleware/authMiddleware.js");
const router = express.Router();

// first way to wright route - this way we can  chain functions to same route
router.route("/").post(registerUser).get(protect, allUsers);

// second way to wright route - this way we can not chain functions to same route
router.post("/login", authUser);

module.exports = router;
