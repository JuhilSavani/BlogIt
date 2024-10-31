import express from "express";
import { login, register, logout, refresh } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/refresh", refresh);

export default router;