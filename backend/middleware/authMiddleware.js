const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // our jwt token will be inside the headers and it will starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // token will look like this
      // Bearer afshjhajfhjafjakjfoiqwremn

      // that is why we will split is to get the actual token that is (afshjhajfhjafjakjfoiqwremn)
      token = req.headers.authorization.split(" ")[1];

      // decode token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      // all the information except password of that user will be stored in the user variable inside req object and will be send to next task/function.
      // this -password(minus password)means that send the user object found with id from the database without password.

      next();
    } catch (error) {
      res.status(401);
      console.log("authMiddleware error");
      throw new Error("Not Authorized, Token Failed");
    }
  }
});

module.exports = { protect };
