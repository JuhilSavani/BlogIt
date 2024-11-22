import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({
      message: "Please provide both username and password to proceed.",
    });

  try {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      const refreshToken = jwt.sign(
        { sub: user._id, username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      const accessToken = jwt.sign(
        { sub: user._id, username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.cookie("x-blogit-token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 3600000, // in milliseconds
      });

      return res.status(200).json({ accessToken, username });
    } else {
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({ message: "An error occurred during login" });
  }
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email)
    return res.status(400).json({
      message: "Please provide username, password, and email to proceed.",
    });

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const refreshToken = jwt.sign(
      { sub: newUser._id, username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const accessToken = jwt.sign(
      { sub: newUser._id, username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    res.cookie("x-blogit-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 3600000, // in milliseconds
    });

    return res.status(200).json({ accessToken, username });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const logout = (req, res) => {
  if (!req.cookies?.["x-blogit-token"]) {
    return res.sendStatus(204); // No Content
  }
  res.clearCookie("x-blogit-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const refresh = (req, res) => {
  const refreshToken = req.cookies["x-blogit-token"];
  if (!refreshToken) return res.sendStatus(401); // Unauthorized if no refresh token

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if refresh token is invalid

    req.user = { _id: user.sub, username: user.username };

    const accessToken = jwt.sign(
      { sub: user.sub, username: user.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    return res.status(200).json({ accessToken, username: user.username });
  });
};
