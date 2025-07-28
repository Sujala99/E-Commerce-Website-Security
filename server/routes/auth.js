const express = require("express");
const router = express.Router();

const authController = require("../controller/auth"); // ✅ This is the controller you created

const {
  loginCheck,
  isAuth,
  isAdmin,
} = require("../middleware/auth");

// ✅ Public routes
router.post("/signup", authController.postSignup);
router.post("/signin", authController.postSignin);
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);

// ✅ Protected routes
router.post("/change-password", loginCheck, isAuth, authController.changePassword);
router.post("/isadmin", loginCheck, isAuth, authController.isAdmin);
router.post("/user", loginCheck, isAuth, isAdmin, authController.allUser);

module.exports = router;
