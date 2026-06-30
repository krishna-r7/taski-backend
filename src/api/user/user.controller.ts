import { Request, Response } from "express";
import User, { UserRole } from "./user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export class UserController {

    createUser = async (req: Request, res: Response) => {
        const { name, email, password, role } = req.body;
        console.log(req.body);

        if (!name || !email || !password || !role) {
            res.status(400).json({ status: 400, message: "All fields are required" });
            return;
        }

        if (!Object.values(UserRole).includes(role)) {
            res.status(400).json({ status: 400, message: "Invalid role" });
            return;
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400).json({ status: 400, message: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role,
        });
        await user.save();
        const userData = await User.findById(user._id).select("-password");
        

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET as string, {
            expiresIn: "30d",
        });

        res.status(200).json({ message: "User created successfully", status: 200, data: { user:userData, token } });
    };

    loginUser = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ status: 400, message: "All fields are required" });
            return;
        }
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ status: 400, message: "User does not exist" });
            return;
        }
        if (!user.isActive) {
            res.status(400).json({ status: 400, message: "User is not active" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ status: 400, message: "Invalid password" });
            return;
        }

        const userData = await User.findById(user._id).select("-password");


        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET as string, {
            expiresIn: "30d",
        });

        res.status(200).json({ message: "User logged in successfully", status: 200, data: { user:userData, token } });
    };

    getAllUsers = async (req: Request, res: Response) => {
        let {page, limit} = req.query as { page: any, limit: any };

        page = Number(page || 1);
        limit = Number(limit) || 10;
        
        const users = await User.find().select("-password ").skip((page - 1) * limit).limit(limit);
        const total = await User.countDocuments();
        res.status(200).json({ status_code: 200, data: users,pagination: {
            total,
            currentPage: page,
            limit,
            totalPages: Math.ceil(total / limit),
        } });
        return;
    }


}