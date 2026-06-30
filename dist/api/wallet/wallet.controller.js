"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const wallet_service_1 = __importDefault(require("./wallet.service"));
class WalletController {
    async createOrder(req, res, next) {
        try {
            const userId = req.user.userId;
            //    console.log(userId,'userId')
            const { amount } = req.body;
            if (!amount || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid amount"
                });
            }
            const order = await wallet_service_1.default.createOrder(userId, Number(amount));
            return res.status(200).json({
                status_code: 200,
                message: "Order created successfully",
                data: order
            });
        }
        catch (error) {
            next(error);
        }
    }
    ;
    async verifyPayment(req, res, next) {
        try {
            const userId = req.user.userId;
            const response = await wallet_service_1.default.verifyPayment(userId, req.body);
            return res.status(200).json({
                status_code: 200,
                message: "Wallet credited successfully",
                data: response
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getBalance(req, res, next) {
        try {
            const userId = req.user.userId;
            const balance = await wallet_service_1.default.getBalance(userId);
            return res.status(200).json({
                status_code: 200,
                message: "Wallet balance retrieved successfully",
                data: balance
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getTransactions(req, res, next) {
        try {
            const userId = req.user.userId;
            const transactions = await wallet_service_1.default.getTransactions(userId);
            return res.status(200).json({
                status_code: 200,
                message: "Wallet transactions retrieved successfully",
                data: transactions
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getWalletTransactions(req, res) {
        try {
            const userId = req.user.userId;
            const result = await wallet_service_1.default.getWalletTransactions(userId, req);
            return res.status(200).json({
                status_code: 200,
                ...result,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getAllWalletTransactions(req, res) {
        // const userId = (req as any).user.userId;
        try {
            const result = await wallet_service_1.default.getAllWalletTransactions(req);
            return res.status(200).json({
                status_code: 200,
                message: "All wallet transactions retrieved successfully",
                ...result,
            });
        }
        catch (error) {
            throw error;
        }
    }
}
exports.WalletController = WalletController;
