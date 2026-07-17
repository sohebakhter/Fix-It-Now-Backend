import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = catchAsync(async (req: Request, res: Response) => {
    const customerId = req.user?.id;
    const payload = req.body;
    const newBooking = await bookingService.createBooking(customerId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Booking created successfully',
        data: newBooking
    });
})

const getAllBookings = catchAsync(async (req: Request, res: Response) => {
    const bookings = await bookingService.getAllBookings();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Bookings fetched successfully',
        data: bookings
    });
})

export const bookingController = {
    createBooking,
    getAllBookings
}