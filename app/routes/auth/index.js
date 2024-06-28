const express = require("express");
const router = express.Router();
const verifyToken = require("../../../middleware/auth");

const {
  register,
  login,
  verifyOtp,
  forgotPassword,
  verifyForgotPasswordOtp,
  updateForgotPassword,
  updateUser,
  ChangePassword,
  findeUser,
} = require("../../controllers/auth");
const upload = require("../../../middleware/imageUpload");

router.post("/register", register);
router.post("/login", login);
router.post("/otp/verify", verifyOtp);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyForgotPassword", verifyForgotPasswordOtp);
router.post("/updatePassword", updateForgotPassword);
router.post("/edit/user", verifyToken, upload.single("image"), updateUser);
router.post("/changepassword", ChangePassword);
router.get("/auth/:token", findeUser);

module.exports = router;
