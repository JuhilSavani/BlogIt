import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";

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
        { sub: user._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      const accessToken = jwt.sign(
        { sub: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.cookie("refresh-token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 3600000, // in milliseconds
      });

      return res.status(200).json({ accessToken });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error.stack);
    return res.status(500).json({ message: "An error occurred during login" });
  }
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      message: "Please provide username, password, and email to proceed.",
    });
  }

  try {
    const existingUser = await User.findOne({ username }).select("_id");
    if (existingUser)
      return res.status(409).json({ message: "User already exists." });

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await User.create({ username, email, password: hashedPassword });

    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refresh-token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  return res.status(200).json({ message: "Logged out successfully" });
};

export const refresh = (req, res) => {
  const refreshToken = req.cookies["refresh-token"];
  if (!refreshToken) return res.sendStatus(401); // Unauthorized if no refresh token

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden if refresh token is invalid
    const accessToken = jwt.sign(
      { sub: user.sub },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    return res.status(200).json({ accessToken });
  });
};
