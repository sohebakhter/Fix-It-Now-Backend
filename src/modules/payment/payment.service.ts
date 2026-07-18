import { PaymentStatus, UserRole } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";

const createCheckoutSession = async (userId: string, bookingId: string) => {
    // ১. ইউজার ভ্যালিডেশন
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) throw new Error("User not found");
    if (user.status === "BAN") throw new Error("User is banned");
    if (user.role !== UserRole.CUSTOMER && user.role !== UserRole.ADMIN) {
        throw new Error("Only customers and admins can create a checkout session");
    }

    // ২. বুকিং ও পেমেন্ট স্ট্যাটাস আগেই চেক করা (স্ট্রাইপ কল করার আগে)
    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { service: true },
    });

    if (!booking) throw new Error("Booking not found");

    const existingPayment = await prisma.payment.findUnique({
        where: { bookingId },
    });

    // পেমেন্ট যদি অলরেডি সাকসেস বা ফেইল্ড হয়ে থাকে, তবে আটকে দেবে
    if (existingPayment && existingPayment.status !== PaymentStatus.PENDING) {
        throw new Error("Payment already completed or failed for this booking");
    }

    let customerId = user.stripeCustomerId;

    // ৩. স্ট্রাইপ কাস্টমার না থাকলে তৈরি করা
    if (!customerId) {
        const customer = await stripe.customers.create({
            email: user.email,
            name: user.name,
        });
        customerId = customer.id;

        // ট্রানজেকশন ছাড়াই ইউজার আপডেট করে নেওয়া ভালো, কারণ এটি ওয়ান-টাইম অপারেশন
        await prisma.user.update({
            where: { id: userId },
            data: { stripeCustomerId: customerId },
        });
    }

    // ৪. স্ট্রাইপ সেশন তৈরি করা
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

    // ৫. প্রিজমা ট্রানজেকশন (Prisma Transaction) ব্যবহার করে পেমেন্ট রেকর্ড তৈরি বা আপডেট করা
    await prisma.$transaction(async (tx) => {
        if (existingPayment) {
            // যদি আগে থেকেই PENDING পেমেন্ট থাকে, তবে স্ট্রাইপ সেশন আইডি আপডেট করো
            await tx.payment.update({
                where: { bookingId },
                data: { stripeCheckoutSessionId: session.id }
            });
        } else {
            // নতুন পেমেন্ট রেকর্ড তৈরি
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

    console.log("Checkout session created and saved:", session);
    return session;
}

export const paymentService = {
    createCheckoutSession,
}