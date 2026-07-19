import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { reviewService } from "./review.service";

const createReview = catchAsync(async (req, res) => {

    const userId = req.user?.id
    const payload = req.body

    const result = await reviewService.createReview( userId as string, payload)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Review created successfully',
        data: result
    });
})

export const reviewController = {
    createReview
}