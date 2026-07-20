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
    const adminId = req.user?.id;
    const bookings = await bookingService.getAllBookings(adminId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Bookings fetched successfully',
        data: bookings
    });
})

const getMyBookings = catchAsync(async (req: Request, res: Response) => {
    const customerId = req.user?.id;
    const bookings = await bookingService.getMyBookings(customerId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Bookings fetched successfully',
        data: bookings
    });
})

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
    const authorizedUserId = req.user?.id;
    const payload = req.body
    const updatedBooking = await bookingService.updateBookingStatus(authorizedUserId as string, payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Booking status updated successfully',
        data: updatedBooking
    });
})

const cancelBooking = catchAsync(async (req: Request, res: Response) => {
    const authorizedUserId = req.user?.id;
    const bookingId = req.params.bookingId
    const updatedBooking = await bookingService.cancelBooking(authorizedUserId as string, bookingId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Booking cancelled successfully',
        data: updatedBooking
    });
})

export const bookingController = {
    createBooking,
    getAllBookings,
    getMyBookings,
    updateBookingStatus,
    cancelBooking
}