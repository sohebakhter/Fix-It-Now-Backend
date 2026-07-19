import { Stripe } from "stripe";
import { BookingStatus, PaymentStatus, UserRole } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handlePaymentIntentSucceeded } from "./payment.utils";

const createCheckoutSession = async (userId: string, bookingId: string) => {

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) throw new Error("User not found");
    if (user.status === "BAN") throw new Error("User is banned");
    if (user.role !== UserRole.CUSTOMER && user.role !== UserRole.ADMIN) {
        throw new Error("Only customers and admins can create a checkout session");
    }

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { service: true },
    });

    if (!booking) throw new Error("Booking not found");

    if (booking.status !== BookingStatus.ACCEPTED) {
        throw new Error("Only accepted bookings can be paid for");
    }

    const existingPayment = await prisma.payment.findUnique({
        where: { bookingId },
    });

    if (existingPayment && existingPayment.status === PaymentStatus.PAID) {
        throw new Error("Payment already completed for this booking");
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
        });
        customerId = customer.id;


        await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customerId },
        });
    }

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    product_data: {
                        name: booking.service?.title || 'Service Payment',
                    },
                    unit_amount: booking.service?.price ? booking.service.price * 100 : 0,
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        customer: customerId,
        payment_method_types: ['card'],
        success_url: `${config.app_url}/payment?success=true`,
        cancel_url: `${config.app_url}/payment?canceled=true`,
        metadata: {
            userId,
            bookingId
        },
    });


    await prisma.$transaction(async (tx) => {
        if (existingPayment) {

            await tx.payment.update({
                where: { bookingId },
                data: { stripeCheckoutSessionId: session.id }
            });
        } else {

            await tx.payment.create({
                data: {
                    bookingId,
                    customerId: userId,
                    serviceId: booking.serviceId,
                    amount: booking.service?.price || 0,
                    status: PaymentStatus.PENDING,
                    stripeCheckoutSessionId: session.id,
                },
            });
        }
    });
    return session;
}

const handleStripeWebhook = async (payload: any, stripeSignature: string) => {
    const endpointSecret = config.stripe_webhook_secret as string;
    // Only verify the event if you have an endpoint secret defined.
    // Otherwise use the basic event deserialized with JSON.parse

    const event = stripe.webhooks.constructEvent(
        payload,
        stripeSignature,
        endpointSecret
    );

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            // Then define and call a method to handle the successful payment intent.
            await handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        case 'payment_intent.payment_failed':
            const paymentIntentFailed = event.data.object;
            // Then define and call a method to handle the successful payment intent.
            // await handlePaymentIntentFailed(paymentIntentFailed);
            break;


        default:
            // Unexpected event type
            console.log(`Unhandled event type ${event.type}.`);
            break;
    }
}

export const paymentService = {
    createCheckoutSession,
    handleStripeWebhook,
}