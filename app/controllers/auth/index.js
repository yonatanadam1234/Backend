const jwtToken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const User = require("../../models/user");
const Otp = require("../../models/otp");
const { CustomAPIError } = require("../../../errors");
const MailSender = require("../../utils/mailSender");
const ejs = require("ejs");
const path = require("path");
// Create User
const register = async (req, res) => {
  try {
    const { email, name } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000);

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      return res.status(400).send({ message: "Email already exists" });
    }
    const data = await ejs.renderFile(
      path.join(__dirname, "../../../views/OtpTemplate.ejs"),
      { name: name, otp: otp, imageUrl: "https://squid-app-oqakh.ondigitalocean.app/logo.png" }
    );

    const sendMailObject = {
      email: email,
      subject: 'OTP Verification',
      html: data
    }
    MailSender(sendMailObject)
    const user = await User.create(req.body);

    const token = jwtToken.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFTIME,
      }
    );

    const loginUser = await User.findOne({ email }).select("-password");

    const alreadyExist = await Otp.findOneAndUpdate(
      email,
      { otp: otp },
      { new: true }
    );

    if (!alreadyExist) {
      await Otp.create({
        otp,
        userId: loginUser._id,
        email,
      });
    }

    return res
      .status(200)
      .send({ user: user, token: token, message: "Otp Sent successfully" });
  } catch (error) {
    return res.status(400).send({ message: error.message });
  }
};
// User Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }
    const query = {
      $and: [{ email: email }, { isverify: true }],
    };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).send({ message: "Invalid credential" });
    }
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).send({ message: "Invalid credential" });
    }

    const token = jwtToken.sign(
      {
        email: email,
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_LIFTIME,
      }
    );
    user.token = token
    await user.save()
    return res
      .status(200)
      .send({ user: user, token, message: "Login succefully" });

  } catch (error) {
    console.log(error);
  }
};

// User Login
const findeUser = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      return res
        .status(400)
        .json({ message: "Please provide Token" });
    }
    const query = {
      $and: [{ token: token }, { isverify: true }],
    };
    const user = await User.findOne(query);
    if (!user) {
      return res.status(400).send({ message: "Invalid credential" });
    }
    return res
      .status(200)
      .send({ user: user, token, message: "Login succefully" });

  } catch (error) {
    console.log(error);
  }
};
// Verify OTP
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send({ message: "Invalid Email" });
    }
    const loginUser = await Otp.findOne({ email, userId: user._id });
    if (loginUser) {
      if (otp === loginUser.otp) {
        user.isverify = true;
        await user.save();

        const data = await ejs.renderFile(
          path.join(__dirname, "../../../views/EmailVerify.ejs"),
          { name: user.name }
        );

        const sendMailObject = {
          email: email,
          subject: 'Welcome',
          html: data
        }
        MailSender(sendMailObject)

        const token = jwtToken.sign(
          { email: user.email, id: user._id },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_LIFTIME,
          }
        );
        user.token = token
        await user.save()
        res.status(200).send({
          message: "OTP verify successfully!",
          user: user,
          success: true,
          token,
        });
        const deleteOtp = await Otp.deleteOne({ email });
      } else {
        return res.status(400).send({ message: "OTP is incorrect" });
      }
    } else {
      return res
        .status(400)
        .send({ message: "OTP has been not sended please try again!" });
    }
  } catch (error) {
    console.log(error);
  }
};
// send OTP for Forgot password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const otp = Math.floor(1000 + Math.random() * 9000);
    const user = await User.findOne({ email });
    if (!user) {
      return next(
        new CustomAPIError(`User not found please enter valid email id`)
      );
    }
    const data = await ejs.renderFile(
      path.join(__dirname, "../../../views/ForgetpasswordTemplate.ejs"),
      { name: user.name, otp: otp }
    );

    const sendMailObject = {
      email: email,
      subject: 'Forgot password',
      html: data
    }
    MailSender(sendMailObject)

    const alreadyExist = await Otp.findOneAndUpdate(
      email,
      { otp: otp },
      { new: true }
    );
    if (!alreadyExist) {
      const otpCreate = await Otp.create({
        otp,
        userId: user._id,
        email,
      });
    }
    return res.status(200).send({ message: "Otp Send succefully" });
  } catch (error) {
    console.log(error);
  }
};
// Verify OTP
const verifyForgotPasswordOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send({ message: "Invalid Email" });
    }
    const otpUser = await Otp.findOne({ email, userId: user._id });
    if (!otpUser) {
      return res.status(400).send({ message: "Something went wrong" });
    }
    if (otp === otpUser.otp) {
      await Otp.deleteOne({ email })
      return res.status(200).send({ message: "OTP verify successfully!" });
    } else {
      return res.status(400).send({ message: "OTP is incorrect" });
    }
  } catch (error) {
    console.log(error);
  }
};
// Update password
const updateForgotPassword = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const { email, password } = req.body;
    const newPassword = await bcrypt.hash(password, salt);

    const updatePassword = await User.findOneAndUpdate(
      { email: email },
      { password: newPassword },
      { new: true }
    );

    return res.status(200).send({ message: "Password has been updated!" });
  } catch (error) {
    return next(error);
  }
};
//Update user
const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const data = {
      name,
      email,
      image: req?.file?.filename,
    };
    const id = req.user.id
    const updatePassword = await User.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );
    res.status(200).send(updatePassword);
  } catch (err) {
    next(err);
  }
};

// ChangePassword
const ChangePassword = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const { email, oldpassword, newpassword } = req.body;
    const newPassword = await bcrypt.hash(newpassword, salt);

    const query = {
      $and: [{ email: email }, { isverify: true }],
    };
    const user = await User.findOne(query);

    const isPasswordCorrect = await user.comparePassword(oldpassword);
    if (!isPasswordCorrect) {
      return res.status(400).send({ message: "Invalid Old Password" });
    }
    const data = await ejs.renderFile(
      path.join(__dirname, "../../../views/ChangePassword.ejs"),
      { name: user.name }
    );

    const sendMailObject = {
      email: email,
      subject: 'Password changed successfully',
      html: data
    }
    MailSender(sendMailObject)

    await User.findOneAndUpdate(
      { email: email },
      { password: newPassword },
      { new: true }
    );

    return res.status(200).send({ message: "Password has been updated!" });
  } catch (error) {
    return next(error);
  }
};
module.exports = {
  register,
  login,
  verifyOtp,
  forgotPassword,
  verifyForgotPasswordOtp,
  updateForgotPassword,
  updateUser,
  ChangePassword,
  findeUser
};
