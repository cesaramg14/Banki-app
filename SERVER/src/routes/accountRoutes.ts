import express from "express";
import { 
  registerAccountController, 
  validateAccountController, 
  getAccountBalanceController,
  getTransactionHistoryController, 
  getAccountController
} from "../controllers/accountController";
import { transferController } from "../controllers/transferController";


const router = express.Router();


router.post("/register", registerAccountController);
router.post("/validate", validateAccountController);
router.get("/:accountNumber/balance", getAccountBalanceController);
router.get("/:accountNumber", getAccountController);


router.post("/transfer", transferController); 


router.get("/:accountNumber/transactions", getTransactionHistoryController);

export default router;