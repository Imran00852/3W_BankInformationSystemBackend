import { Router } from "express";
import {
  getMyDetails,
  login,
  logout,
  register,
} from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getMyDetails);
router.get("/logout", logout);

export default router;
