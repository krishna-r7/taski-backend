import { Schema, model, Document, Types } from "mongoose";

export interface IWalletTransaction extends Document {
  user: Types.ObjectId;
  booking?: Types.ObjectId;
  type: "CREDIT" | "DEBIT" | "REFUND";
  amount: number;
  paymentGateway: string;
  paymentId: string;
  orderId: string;
  status: string;
}

export enum TransactionType {
  CREDIT = "CREDIT",
  DEBIT = "DEBIT",
  REFUND = "REFUND",
}

const walletTransactionSchema = new Schema<IWalletTransaction>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    booking: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
  }
);

export default model<IWalletTransaction>(
  "WalletTransaction",
  walletTransactionSchema
);