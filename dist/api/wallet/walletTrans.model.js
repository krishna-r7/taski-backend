"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionType = void 0;
const mongoose_1 = require("mongoose");
var TransactionType;
(function (TransactionType) {
    TransactionType["CREDIT"] = "CREDIT";
    TransactionType["DEBIT"] = "DEBIT";
    TransactionType["REFUND"] = "REFUND";
})(TransactionType || (exports.TransactionType = TransactionType = {}));
const walletTransactionSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    booking: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Booking",
        default: null,
    },
    type: {
        type: String,
        enum: Object.values(TransactionType),
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentGateway: {
        type: String,
        required: true,
    },
    paymentId: {
        type: String,
        required: true,
    },
    orderId: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)("WalletTransaction", walletTransactionSchema);
