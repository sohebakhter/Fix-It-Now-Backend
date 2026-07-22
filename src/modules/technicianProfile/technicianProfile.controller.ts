import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import httpStatus from "http-status"
import { technicianProfileService } from "./technicianProfile.service";

const getTechnicians = catchAsync(async (req, res) => {

    const technicians = await technicianProfileService.getTechnicians();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Technicians fetched successfully',
        data: technicians
    });
})

const getTechnicianProfile = catchAsync(async (req, res) => {

    const technicianId = req.params.technicianId
    const technician = await technicianProfileService.getTechnicianProfile(technicianId as string);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Technician profile fetched successfully',
        data: technician
    });
})

export const technicianProfileController = {
    getTechnicians,
    getTechnicianProfile
}