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

const getMyProfile = catchAsync(async (req, res, next) => {

    const userId = req.user?.id

    const result = await userService.getMyProfile(userId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User profile fetched successfully',
        data: result
    })

})

const updateMyProfile = catchAsync(async (req, res, next) => {

    const userId = req.user?.id
    const payload = req.body

    const result = await userService.updateMyProfile(userId as string, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User profile updated successfully',
        data: result
    })

})



const deleteMyProfile = catchAsync(async (req, res, next) => {

    const userId = req.user?.id

    const result = await userService.deleteMyProfile(userId as string)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User profile deleted successfully',
        data: result
    })
})

export const userController = {
    registerUser,
    getMyProfile,
    updateMyProfile,
    deleteMyProfile
}