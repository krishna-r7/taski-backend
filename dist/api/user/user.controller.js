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
exports.UserController = void 0;
const user_model_1 = __importStar(require("./user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UserController {
    createUser = async (req, res) => {
        const { name, email, password, role } = req.body;
        console.log(req.body);
        if (!name || !email || !password || !role) {
            res.status(400).json({ status: 400, message: "All fields are required" });
            return;
        }
        if (!Object.values(user_model_1.UserRole).includes(role)) {
            res.status(400).json({ status: 400, message: "Invalid role" });
            return;
        }
        const userExists = await user_model_1.default.findOne({ email });
        if (userExists) {
            res.status(400).json({ status: 400, message: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const user = new user_model_1.default({
            name,
            email,
            password: hashedPassword,
            role,
        });
        await user.save();
        const userData = await user_model_1.default.findById(user._id).select("-password");
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        res.status(200).json({ message: "User created successfully", status: 200, data: { user: userData, token } });
    };
    loginUser = async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ status: 400, message: "All fields are required" });
            return;
        }
        const user = await user_model_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ status: 400, message: "User does not exist" });
            return;
        }
        if (!user.isActive) {
            res.status(400).json({ status: 400, message: "User is not active" });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ status: 400, message: "Invalid password" });
            return;
        }
        const userData = await user_model_1.default.findById(user._id).select("-password");
        const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });
        res.status(200).json({ message: "User logged in successfully", status: 200, data: { user: userData, token } });
    };
    getAllUsers = async (req, res) => {
        let { page, limit } = req.query;
        page = Number(page || 1);
        limit = Number(limit) || 10;
        const users = await user_model_1.default.find().select("-password ").skip((page - 1) * limit).limit(limit);
        const total = await user_model_1.default.countDocuments();
        res.status(200).json({ status_code: 200, data: users, pagination: {
                total,
                currentPage: page,
                limit,
                totalPages: Math.ceil(total / limit),
            } });
        return;
    };
}
exports.UserController = UserController;
