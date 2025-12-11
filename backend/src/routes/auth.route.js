import express from "express";
import { signup, login, logout, checkAuth, googleAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google", googleAuth);
router.get("/check", protectRoute, checkAuth); // Add this new route

export default router;