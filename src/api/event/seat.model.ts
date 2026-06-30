import { Schema, model, Document, Types } from "mongoose";

export interface ISeat extends Document {
  event: Types.ObjectId;
  seatNumber: string;
  status: "AVAILABLE" | "RESERVED" | "BOOKED";
  reservedBy?: Types.ObjectId;
  reservedUntil?: Date;
  seatIndex: number;
  isDeleted: boolean;
}

const seatSchema = new Schema<ISeat>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    seatNumber: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["AVAILABLE", "RESERVED", "BOOKED"],
      default: "AVAILABLE",
    },

    reservedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    seatIndex: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    reservedUntil: Date,
  },

  
  {
    timestamps: true,
  }
);

export default model<ISeat>("Seat", seatSchema);