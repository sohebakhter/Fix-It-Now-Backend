import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma"
import { IReviewPayload } from "./review.interface";

const createReview = async (userId: string, payload: IReviewPayload) => {

    const { bookingId, rating, comment } = payload

    const booking = await prisma.booking.findUnique({
        where: {
            id: bookingId,
        },
        include: {
            service: true,
        },
    });

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (booking.customerId !== userId) {
        throw new Error("Unauthorized");
    }

    if (booking.status !== BookingStatus.COMPLETED) {
        throw new Error("Booking is not completed yet");
    }

    const review = await prisma.review.findUnique({
        where: {
            bookingId,
        },
    });

    if (review) {
        throw new Error("Review already submitted");
    }

    const newReview = await prisma.review.create({
        data: {
            bookingId,
            customerId: userId,
            serviceId: booking.serviceId,
            rating,
            comment,
        },
    });

    return newReview

}

export const reviewService = {
    createReview
}