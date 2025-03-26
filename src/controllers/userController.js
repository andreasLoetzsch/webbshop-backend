const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const createUser = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    if (username.length < 3 || username.length > 13) {
      return res.status(401).json({
        success: false,
        message:
          "Username needs to be atleast 3 characters and cant be longer than 13",
      });
    }
    if (password.length < 6) {
      return res.status(401).json({
        success: false,
        message: "password needs to be atleast 6 characters",
      });
    }

    function isEmailValid(email) {
      const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailCheck.test(email);
    }

    if (!isEmailValid(email)) {
      return res
        .status(401)
        .json({ success: false, message: "Email is not valid" });
    }
    const emailAlreadyInUse = await User.findOne({
      email: { $regex: "^" + email + "$", $options: "i" },
    });

    if (emailAlreadyInUse) {
      res
        .status(401)
        .json({ success: false, message: "Email is already taken" });
    }

    const usernameAlreadyInUse = await User.findOne({
      username: { $regex: "^" + username + "$", $options: "i" },
    });

    if (usernameAlreadyInUse) {
      return res
        .status(401)
        .json({ success: false, message: "username already taken" });
    }

    const user = new User({
      username: username,
      password: password,
      email: email,
    });
    await user.save();
    res.status(200).json({ success: true, message: "User created" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res
        .status(401)
        .json({ success: false, message: "Username and password required" });
    }
    const user = await User.findOne({
      username: { $regex: "^" + username + "$", $options: "i" },
    });
    const passwordCheck = await user.checkPassword(password);
    if (!user || !passwordCheck) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const accessToken = await jwt.sign(
      {
        username: user.username,
        email: user.email,
        userId: user._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 1000,
    });
    res.status(200).json({ success: true, message: "Logged in" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

module.exports = { createUser, loginUser };
