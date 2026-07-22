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
    const query = req.query
    const services = await serviceService.getAllServices(query);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Services fetched successfully',
        data: services
    });
})

const getMyServices = catchAsync(async (req: Request, res: Response) => {
    const authorizedUserId = req.user?.id;
    const services = await serviceService.getMyServices(authorizedUserId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Services fetched successfully',
        data: services
    });
})

const updateService = catchAsync(async (req: Request, res: Response) => {
    const authorizedUserId = req.user?.id;
    const serviceId = req.params.serviceId;
    const payload = req.body;

    const updatedService = await serviceService.updateService(
        authorizedUserId as string,
        serviceId as string,
        payload
    );

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Service updated successfully",
        data: updatedService,
    });
});

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
    deleteService,
    getMyServices,
    updateService
}