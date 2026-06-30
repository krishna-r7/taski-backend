import mongoose from "mongoose";

const counterSchema = new mongoose.Schema({
  _id: String,
  seq: {
    type: Number,
    default: 100,
  },
});

export default mongoose.model("Counter", counterSchema);