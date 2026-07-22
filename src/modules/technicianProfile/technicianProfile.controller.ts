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

export const technicianProfileController = {
    getTechnicians
}