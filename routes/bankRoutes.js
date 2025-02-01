import { Router } from "express";
import {
  addBankAccount,
  deleteBankAccount,
  getAllBanks,
  updateBankDetails,
} from "../controllers/bankControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = Router();

router.post("/bank-accounts", isAuthenticated, addBankAccount);
router
  .route("/bank-accounts/:id")
  .get(isAuthenticated, getAllBanks)
  .put(isAuthenticated, updateBankDetails)
  .delete(isAuthenticated, deleteBankAccount);

export default router;
