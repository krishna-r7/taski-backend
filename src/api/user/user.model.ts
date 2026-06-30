import { Schema, model, InferSchemaType } from "mongoose";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      // select: false,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export type User = InferSchemaType<typeof UserSchema>;

export default model<User>("User", UserSchema);