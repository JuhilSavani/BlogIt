import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";
import { connectMongo } from "./config/db.config.js";
import authRoutes from "./routes/auth.routes.js";
import protectedRoutes from "./routes/protected.routes.js";
import "./config/passport.config.js";

// Set up the server
const PORT = process.env.PORT || 4000;
const app = express();

// Connect to MongoDB
connectMongo();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allows the server to send, accept and edit credentials like httpOnly cookies.
    optionsSuccessStatus: 200,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Tests
app.get("/health-check", (req, res) => {
  return res.json({ message: "200: Ok" });
});
app.post("/health-check", (req, res) => {
  const reqBody = req.body;
  return res.json({ ...reqBody });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/protected", protectedRoutes);

app.listen(PORT, () => {
  process.stdout.write(`Server is running at http://localhost:${PORT}\n`);
});
