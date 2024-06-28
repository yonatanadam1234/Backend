const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Please Provide Email"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Please Provide Password"],
    minLength: 6,
  },
  phone: {
    type: Number
  },
  role: {
    type: String,
    default: 'user'
  },
  address: {
    type: String,
    required: [true, "please provide Address"]
  },
  token: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: ''
  },
  isverify: {
    type: Boolean,
    default: false,
  },
  subscriptionPlan: {
    type: String,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }
  this.password = await bcrypt.hash(this.password, 10)
})

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch
};

module.exports = mongoose.model("User", UserSchema);
