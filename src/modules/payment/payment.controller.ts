import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { paymentService } from "./payment.service";

const createCheckoutSession = catchAsync(async (req, res) => {
    const userId = req.user?.id;
    const bookingId = req.body.bookingId;

    const session = await paymentService.createCheckoutSession(userId!, bookingId!);

    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Checkout session created successfully",
        data: {
            paymentUrl: session.url,
            sessionId: session.id,
        },
    });
});

const handleStripeWebhook = catchAsync(async (req, res) => {
    const payload = req.body;
    const stripeSignature = req.headers['stripe-signature'] as string;
    await paymentService.handleStripeWebhook(payload, stripeSignature);
    return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Webhook triggered successfully",
        data: {},
    });
});

export const paymentController = {
    createCheckoutSession,
    handleStripeWebhook,
};