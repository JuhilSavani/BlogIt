import express from "express";
import cors from "cors";
import { connectMongo } from "./config/db.config";

const PORT = process.env.PORT || 4000;
const app = express();

connectMongo();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

app.get("/", (req, res) => {
  return res.json({"msg": "200: Ok"});
});

app.listen(PORT, () => {
  process.stdout.write(`Server is running at http://localhost:${PORT}\n`);
});
