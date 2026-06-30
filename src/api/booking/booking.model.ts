import { Schema, model, Document, Types } from "mongoose";

export interface IBooking extends Document {
  user: Types.ObjectId;
  event: Types.ObjectId;
  seats: Types.ObjectId[];
  totalAmount: number;
  status: "CONFIRMED" | "CANCELLED" | "PENDING";
  reservedUntil: Date | null;
  bookingKey: string;
  refunded: boolean;
  refundedAt: Date | null;
  refundAmount: number;
  paymentStatus: "PAID" | "UNPAID" | "REFUNDED";

}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    seats: [
      {
        type: Schema.Types.ObjectId,
        ref: "Seat",
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED", "PENDING",],
      default: "PENDING",
    },

    paymentStatus: {
      type: String,
      enum: ["PAID", "UNPAID", "REFUNDED"],
      default: "UNPAID",
    },

    reservedUntil: {
      type: Date,
      default: null,
    },
    bookingKey: {
      type: String,
      required: true,
    },

    refunded: {
      type: Boolean,
      default: false,
    },

    refundedAt: {
      type: Date,
      default: null,
    },

    refundAmount: {
      type: Number,
      default: 0,
    },

    
   
  },
  {
    timestamps: true,
  }
);

export default model<IBooking>("Booking", bookingSchema);