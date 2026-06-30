"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const razorpay_1 = __importDefault(require("razorpay"));
// console.log("KEY_ID:", process.env.APP_NAME);
// console.log("KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);
const razorpay = new razorpay_1.default({
    key_id: "rzp_test_T6gCKGVzlDutaO",
    key_secret: "L6e4JeaRyu7whoIg498pGkpp",
});
exports.default = razorpay;
