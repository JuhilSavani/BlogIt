import express from "express";
import cors from "cors";
import env from "dotenv";

const PORT = process.env.PORT || 4000;
const app = express();
env.config();

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
  return res.json({"msg": "Ok"});
});

app.listen(PORT, () => {
  process.stdout.write(`Server is running at http://localhost:${PORT}\n`);
});
