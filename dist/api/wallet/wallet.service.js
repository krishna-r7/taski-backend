"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = __importDefault(require("mongoose"));
const razorpay_1 = __importDefault(require("../../config/razorpay"));
const user_model_1 = __importDefault(require("../user/user.model"));
const walletTrans_model_1 = __importStar(require("./walletTrans.model"));
class WalletService {
    /**
     * Create Razorpay Order
     */
    async createOrder(userId, amount) {
        console.log(userId, amount);
        if (amount <= 0) {
            throw new Error("Invalid amount");
        }
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const order = await razorpay_1.default.orders.create({
            amount: amount * 100,
            currency: "INR",
            receipt: `wallet__${Date.now()}`,
            payment_capture: true,
        });
        return {
            key: process.env.RAZORPAY_KEY_ID,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        };
    }
    /**
     * Verify Razorpay Payment
     */
    async verifyPayment(userId, body) {
        const { amount, razorpay_order_id, razorpay_payment_id, razorpay_signature, } = body;
        const orderAmount = amount / 100;
        const generatedSignature = crypto_1.default.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id).digest("hex");
        if (generatedSignature !== razorpay_signature) {
            return {
                message: "Invalid payment signature",
                status_code: 400,
                data: null,
            };
        }
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const user = await user_model_1.default.findById(userId).session(session);
            if (!user) {
                throw new Error("User not found");
            }
            user.walletBalance += orderAmount;
            await user.save({ session });
            const t = await walletTrans_model_1.default.create([
                {
                    user: user._id,
                    type: walletTrans_model_1.TransactionType.CREDIT,
                    amount: orderAmount,
                    paymentGateway: "RAZORPAY",
                    paymentId: razorpay_payment_id,
                    orderId: razorpay_order_id,
                    status: "SUCCESS",
                },
            ], { session });
            console.log("t", t);
            await session.commitTransaction();
            return {
                walletBalance: user.walletBalance,
            };
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    /**
     * Wallet Balance
     */
    async getBalance(userId) {
        const user = await user_model_1.default.findById(userId).select("walletBalance");
        if (!user) {
            return {
                message: "User not found",
                status_code: 404,
                data: null,
            };
        }
        return {
            walletBalance: user.walletBalance,
        };
    }
    /**
     * Wallet History
     */
    async getTransactions(userId) {
        return await walletTrans_model_1.default.find({
            user: userId,
        }).sort({
            createdAt: -1,
        }).limit(5);
    }
    async getWalletTransactions(userId, req) {
        let { page = 1, limit = 10 } = req.query;
        page = Number(page);
        limit = Number(limit);
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            walletTrans_model_1.default.find({ user: userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            walletTrans_model_1.default.countDocuments({ user: userId }),
        ]);
        return {
            transactions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    ;
    async getAllWalletTransactions(req) {
        let { page = 1, limit = 10 } = req.query;
        page = Number(page);
        limit = Number(limit);
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            walletTrans_model_1.default.find().populate("user", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit),
            walletTrans_model_1.default.countDocuments({}),
        ]);
        return {
            transactions,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
}
exports.default = new WalletService();
