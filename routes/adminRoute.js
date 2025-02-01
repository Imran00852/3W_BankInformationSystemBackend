import { Router } from "express";
import {
  adminLogin,
  search,
  userDetails,
} from "../controllers/adminControllers.js";

const router = Router();
router.post("/login", adminLogin);
router.get("/users", userDetails);
router.get("/users/search", search);
export default router;
