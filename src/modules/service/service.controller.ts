import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { serviceService } from "./service.service";

const createService = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id //userId is the technicianId in this case
    const payload = req.body;
    const newService = await serviceService.createService(userId as string, payload);

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

const deleteService = catchAsync(async (req: Request, res: Response) => {
    const authorizedUserId = req.user?.id; // Assuming the user ID is available in the request object
    const { serviceId } = req.params;
    const deletedService = await serviceService.deleteService(authorizedUserId as string, serviceId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Service deleted successfully',
        data: deletedService
    });
})

export const serviceController = {
    createService,
    getAllServices,
    deleteService
}