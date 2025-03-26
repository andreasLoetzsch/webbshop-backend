const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userModel = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});

userModel.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const genSalt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, genSalt);
  next();
});

userModel.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("user", userModel);
