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

    if (rating === null || rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5");
    }

    const review = await prisma.review.findUnique({
        where: {
            bookingId,
        },
    });

    if (review) {
        throw new Error("Review already submitted");
    }


    const result = await prisma.$transaction(async (tx) => {
        const newReview = await tx.review.create({
            data: {
                bookingId,
                customerId: userId,
                serviceId: booking.serviceId,
                rating,
                comment,
            },
        });

        const averageRating = await tx.review.aggregate({
            where: {
                service: {
                    technicianId: booking.service.technicianId,
                },
            },
            _avg: {
                rating: true,
            },
        });

        await tx.technicianProfile.update({
            where: {
                id: booking.service.technicianId,
            },
            data: {
                rating: averageRating._avg.rating ?? 0,
            },
        });

        return newReview;
    });

    return result
}

export const reviewService = {
    createReview
}