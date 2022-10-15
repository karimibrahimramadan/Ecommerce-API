const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, unique: true },
    role: { type: String, default: "User" },
    confirmEmail: { type: Boolean, default: false },
    wishList: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    active: { type: Boolean, default: true, select: false },
    passwordResetToken: { type: String, default: "" },
    passwordResetExpires: Date,
    passwordChangedAt: Date,
    photo: String,
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRE,
  });
};

userSchema.methods.getEmailJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EMAIL_EXPIRE,
  });
};

userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

userSchema.methods.hashPassword = async function (inputPassword) {
  const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
  return await bcrypt.hash(inputPassword, salt);
};

userSchema.methods.createResetPasswordToken = function () {
  return crypto.randomBytes(32).toString("hex");
};

const User = mongoose.model("User", userSchema);

module.exports = User;
