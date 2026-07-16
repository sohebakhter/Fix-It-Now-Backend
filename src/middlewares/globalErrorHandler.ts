import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("Error :", err)

    let statusCode
    let errorMessage = err.message || "Internal Server Error"
    let errorName = err.name || "Internal Server Error"

    res.status(statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        name: errorName,
        message: errorMessage,
        error: err.stack
    })
}