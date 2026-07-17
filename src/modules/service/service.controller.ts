import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { serviceService } from "./service.service";

const createService = catchAsync(async (req: Request, res: Response) => {
    const technicianId = req.user?.id
    const payload = req.body;
    const newService = await serviceService.createService(technicianId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Service created successfully',
        data: newService
    });
})

const getAllServices = catchAsync(async (req: Request, res: Response) => {
    const services = await serviceService.getAllServices();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Services fetched successfully',
        data: services
    });
})

export const serviceController = {
    createService,
    getAllServices
}