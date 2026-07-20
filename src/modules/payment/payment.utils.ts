import Stripe from "stripe";
import { BookingStatus, PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const handlePaymentIntentSucceeded = async (paymentIntent: Stripe.PaymentIntent) => {

    const currentCheckoutSessionId = paymentIntent.payment_details?.order_reference;

    await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.update({
            where: { stripeCheckoutSessionId: currentCheckoutSessionId! },
            data: {
                status: PaymentStatus.PAID,
                stripePaymentIntentId: paymentIntent.id,
            }
        });

        const booking = await tx.booking.findUnique({
            where: { id: payment.bookingId },
        });

        if (booking) {
            await tx.booking.update({
                where: { id: booking.id },
                data: { status: BookingStatus.PAID },
            });
        }
    })


}