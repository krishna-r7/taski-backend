
import { Request, Response, NextFunction } from "express";
import WalletService from "./wallet.service";


export class WalletController {

    async createOrder(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

           const userId = (req as any).user.userId;
        //    console.log(userId,'userId')

            const { amount } = req.body;

            if (!amount || amount <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid amount"
                });
            }

            const order = await WalletService.createOrder(
                userId,
                Number(amount)
            );

            return res.status(200).json({
                status_code: 200,  
                message: "Order created successfully",
                data: order
            });

        } catch (error) {
            next(error);
        }
    };


    async verifyPayment(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {

           const userId = (req as any).user.userId;

            const response = await WalletService.verifyPayment(
                userId,
                req.body
            );

            return res.status(200).json({
                status_code: 200,  
                message: "Wallet credited successfully",
                data: response
            });

        } catch (error) {
            next(error);
        }
    }

    async getBalance(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

            const userId = (req as any).user.userId;

            const balance = await WalletService.getBalance(userId);

            return res.status(200).json({
                status_code: 200,  
                message: "Wallet balance retrieved successfully",
                data: balance
            });
            
        } catch (error) {
            next(error);
        }

    }

    async getTransactions(
        req: Request,
        res: Response,
        next: NextFunction
    ) {

        try {

            const userId = (req as any).user.userId;

            const transactions =
                await WalletService.getTransactions(userId);

            return res.status(200).json({
                status_code: 200,  
                message: "Wallet transactions retrieved successfully",
                data: transactions
            });

        } catch (error) {
            next(error);
        }

    }

    async getWalletTransactions(req: Request, res: Response) {
      try {
        const userId = (req as any).user.userId;
    
        const result = await WalletService.getWalletTransactions(userId, req as any);
    
        return res.status(200).json({
          status_code: 200,
          ...result,
        });
      } catch (error) {
        throw error;
      }
    }

    async getAllWalletTransactions(req: Request, res: Response) {
        // const userId = (req as any).user.userId;
        try {
            const result = await WalletService.getAllWalletTransactions(req as any);
            return res.status(200).json({
                status_code: 200,
                message: "All wallet transactions retrieved successfully",
                ...result,
            });
        } catch (error) {
            throw error;
        }
    }



}