import { Router } from "express";
import { WalletController } from "./wallet.controller";

const router = Router();
const walletController = new WalletController();

router.post("/create-order", walletController.createOrder);

router.post("/verify-payment", walletController.verifyPayment);

router.get("/balance", walletController.getBalance);

router.get("/transactions", walletController.getTransactions);

router.get("/wallet-transactions", walletController.getWalletTransactions);

router.get("/all", walletController.getAllWalletTransactions);



export default router;