import crypto from "crypto";
import mongoose from "mongoose";

import razorpay from "../../config/razorpay";

import User from "../user/user.model";
import WalletTransaction, { TransactionType, } from "./walletTrans.model";

class WalletService {
    /**
     * Create Razorpay Order
     */
    async createOrder(userId: string, amount: number) {

        console.log(userId, amount);
        
        if (amount <= 0) {
            throw new Error("Invalid amount");
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const order = await razorpay.orders.create({
            amount : amount * 100,
            currency: "INR",    
            receipt: `wallet__${Date.now()}`,
            payment_capture: true,
        });

        return {
            key: "rzp_test_T6gCKGVzlDutaO",
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
        };
    }

    /**
     * Verify Razorpay Payment
     */
    async verifyPayment(
        userId: string,
        body: {
            amount: number;
            razorpay_order_id: string;
            razorpay_payment_id: string;
            razorpay_signature: string;
        }
    ) {
        const {
            amount,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = body;

        const orderAmount = amount / 100;

        const generatedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string )
            .update( razorpay_order_id + "|" + razorpay_payment_id ).digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return {
                message: "Invalid payment signature",
                status_code: 400,
                data: null,
            };
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const user = await User.findById(userId).session(session);

            if (!user) {
                throw new Error("User not found");
            }

            user.walletBalance += orderAmount;

            await user.save({ session });

           const t =  await WalletTransaction.create(
                [
                    {
                        user: user._id,

                        type: TransactionType.CREDIT,

                        amount: orderAmount,

                        paymentGateway: "RAZORPAY",

                        paymentId: razorpay_payment_id,

                        orderId: razorpay_order_id,

                        status: "SUCCESS",
                    },
                ],
                { session }
            );

            console.log ("t", t);

            await session.commitTransaction();

            return {
                walletBalance: user.walletBalance,
            };

        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Wallet Balance
     */
    async getBalance(userId: string) {
        const user = await User.findById(userId).select(
            "walletBalance"
        );

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
    async getTransactions(userId: string) {
        return await WalletTransaction.find({
            user: userId,
        }).sort({
            createdAt: -1,
        }).limit(5);
        
    }

    async getWalletTransactions(userId: string, req: any) {

        let { page = 1, limit = 10 } = req.query;

        page = Number(page);
        limit = Number(limit);

        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
              WalletTransaction.find({ user: userId })

                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
        
              WalletTransaction.countDocuments({ user: userId }),
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
    };

    async getAllWalletTransactions( req: any) {
        let { page = 1, limit = 10 } = req.query;
        page = Number(page);
        limit = Number(limit);
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            WalletTransaction.find().populate("user", "name email").sort({ createdAt: -1 }).skip(skip).limit(limit),
            WalletTransaction.countDocuments({}),
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

export default new WalletService();