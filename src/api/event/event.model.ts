import { Schema, model, Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  description: string;
  venue: string;
  eventDate: Date;
  totalSeats: number;
  price: number;
  isDeleted: boolean;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    venue: {
      type: String,
      required: true,
    },

    eventDate: {
      type: Date,
      required: true,
    },

    totalSeats: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IEvent>("Event", eventSchema);