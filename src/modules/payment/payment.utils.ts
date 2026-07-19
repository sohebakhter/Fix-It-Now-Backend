import Stripe from "stripe";
import { PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const handlePaymentIntentSucceeded = async (paymentIntent: Stripe.PaymentIntent) => {

    const currentCheckoutSessionId = paymentIntent.payment_details?.order_reference;
    await prisma.payment.update({
        where: { stripeCheckoutSessionId: currentCheckoutSessionId! },
        data: {
            status: PaymentStatus.PAID,
            stripePaymentIntentId: paymentIntent.id,
        }
    });


}