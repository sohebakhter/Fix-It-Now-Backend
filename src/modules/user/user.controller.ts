import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { userService } from "./user.service"
import httpStatus from "http-status"

const registerUser = catchAsync(async (req, res, next) => {

    const payload = req.body

    const result = await userService.registerUser(payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User registered successfully',
        data: result
    })
})

const getMyProfile = () => { }

const updateMyProfile = () => { }

const deleteMyProfile = () => { }

export const userController = {
    registerUser,
    getMyProfile,
    updateMyProfile,
    deleteMyProfile
}