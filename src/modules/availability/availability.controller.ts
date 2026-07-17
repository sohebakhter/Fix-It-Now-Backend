import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { availabilityService } from "./availability.service";

const createAvailability = catchAsync(async (req: Request, res: Response) => {
    const technicianId = req.user?.id;
    const payload = req.body;
    const newAvailability = await availabilityService.createAvailability(technicianId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Availability created successfully',
        data: newAvailability
    });
})

const getAllAvailabilities = catchAsync(async (req: Request, res: Response) => {
    const availabilities = await availabilityService.getAllAvailabilities();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Availabilities fetched successfully',
        data: availabilities
    });
})

export const availabilityController = {
    createAvailability,
    getAllAvailabilities
}