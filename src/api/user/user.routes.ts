import express from "express";
import { UserController } from "./user.controller";

const router = express.Router();
const userController = new UserController();

router.post("/signup", userController.createUser);    
router.post("/login", userController.loginUser);
// router.get("/dashboard", userController.getDashboardData);
router.get("/all", userController.getAllUsers);




export default router;