import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { authService } from "./auth.service"
import httpStatus from "http-status"

const loginUser = catchAsync(async (req, res, next) => {
    const payload = req.body
    const { accessToken, refreshToken } = await authService.loginUser(payload)

    res.cookie("accessToken", accessToken, { httpOnly: true, sameSite: "none", secure: false, maxAge: 1000 * 60 * 60 * 24 })
    res.cookie("refreshToken", refreshToken, { httpOnly: true, sameSite: "none", secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'User logged in successfully',
        data: { accessToken, refreshToken }
    })
})

const refreshToken = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.cookies
    const newAccessToken = await authService.refreshToken(refreshToken)

    res.cookie("accessToken", newAccessToken, { httpOnly: true, sameSite: "none", secure: false, maxAge: 1000 * 60 * 60 * 24 })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Access token refreshed successfully',
        data: { accessToken: newAccessToken }
    })
})

const sendOtp = catchAsync(async (req, res, next) => {
    const email = req.body.email
    await authService.sendOtp(email)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'OTP sent successfully',
        data: null
    })
})

const verifyOtp = catchAsync(async (req, res, next) => {
    const email = req.body.email
    const otp = req.body.otp
    await authService.verifyOtp(email, otp)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'OTP verified successfully',
        data: null
    })
})

const resetPassword = catchAsync(async (req, res, next) => {
    const email = req.body.email
    const otp = req.body.otp
    const password = req.body.password
    await authService.resetPassword(email, otp, password)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Password reset successfully',
        data: null
    })
})

export const authController = {
    loginUser,
    refreshToken,
    sendOtp,
    verifyOtp,
    resetPassword
}