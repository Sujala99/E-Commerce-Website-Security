const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const userModel = require("../models/users");

exports.loginCheck = (req, res, next) => {
  try {
    let token = req.headers.token?.replace("Bearer ", "");
    const decode = jwt.verify(token, JWT_SECRET);
    req.userDetails = decode;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Session expired. Please login again." });
  }
};

exports.isAuth = (req, res, next) => {
  let { loggedInUserId } = req.body;
  if (!loggedInUserId || loggedInUserId != req.userDetails._id) {
    return res.status(403).json({ error: "Unauthorized" });
  }
  next();
};

exports.isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.body.loggedInUserId);
    if (user.userRole !== 1) {
      return res.status(403).json({ error: "Admin access denied" });
    }
    next();
  } catch {
    return res.status(404).json({ error: "User not found" });
  }
};
