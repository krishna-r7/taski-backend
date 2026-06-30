import { Request, Response, NextFunction } from "express";
import bookingService from "./booking.service";

class BookingController {

  async reserveSeats(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      // console.log('sssss',userId, 'user id');

      const { eventId, seatIds } = req.body;

      if (!eventId || !seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
        res.status(400).json({
          success: false,
          message: "eventId and seatIds are required",
        });
        return;
      }

      const result = await bookingService.reserveSeats(
        userId,
        eventId,
        seatIds
      );

      res.status(200).json({
        status_code: 200,
        message: "Seats reserved successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }


  async confirmBooking(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;

      const { eventId, bookingId } = req.body;

      if (!bookingId) {
        res.status(400).json({
          success: false,
          message: "bookingId is required",
        });
        return;
      }

      const booking = await bookingService.confirmBooking(
        userId,
        // eventId,
        bookingId
      );

      res.status(200).json({
        status_code: 200,
        message: "Booking confirmed successfully",
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  }


  async getBookingHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.id;

      const bookings = await bookingService.getBookingHistory(userId);

      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  };

  async getBookingDetail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = (req as any).user.userId;
      const bookingId = req.params.id as string;
      const booking = await bookingService.getBookingDetail(userId, bookingId);
      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  };


  async getBookings(req: Request, res: Response) {
    try {
      const userId = (req as any).user.userId;

      const result = await bookingService.getBookingsHistory(userId, req as any);

      return res.status(200).json({
        status_code: 200,
        ...result,
      });
    } catch (error) {
      throw error;
    }
  }


    async getAllUserBookings(req: Request, res: Response) {
    try {


      const result = await bookingService.getAllUserBookings(req as any);

      return res.status(200).json({
        status_code: 200,
        ...result,
      });
    } catch (error) {
      throw error;
    }
  }

  async cancelBooking(req: Request, res: Response) {
    try {
      // const userId = (req as any).user.userId;
      const bookingId = req.params.id as string;
      const result = await bookingService.cancelBooking(bookingId);
      return res.status(200).json({
        status_code: 200,
        message: "Booking cancelled successfully",
        ...result,
      });
    } catch (error) {
      throw error;
    }
  }

  async refundBooking(req: Request, res: Response) {
    try {
      const bookingId = req.params.id as string;
      const result = await bookingService.refundBooking(bookingId);
      return res.status(200).json({
        status_code: 200,
        message: "Booking refunded successfully",
        ...result,
      });
    } catch (error) {
      throw error;
    }
  }

 
  }

export default new BookingController();