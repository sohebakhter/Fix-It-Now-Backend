import { BookingStatus, ServiceStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma"
import { IBookingPayload } from "./booking.interface"

const createBooking = async (customerId: string, payload: IBookingPayload) => {

    // Implementation for creating a booking
    const transactionResult = await prisma.$transaction(async (tx) => {
        const { serviceId, availabilityId } = payload;

        if (!serviceId || !availabilityId) {
            throw new Error("Missing required fields");
        }

        const service = await tx.service.findUnique({
            where: {
                id: serviceId
            }
        });

        if (!service) {
            throw new Error("Service not found");
        }

        if (service.status !== ServiceStatus.ACTIVE) {
            throw new Error("Service is not available");
        }

        const availability = await tx.availability.findUnique({
            where: {
                id: availabilityId,
                technicianId: service.technicianId,
            },
        });

        if (!availability) {
            throw new Error("Invalid availability for this service");
        }


        const existingBooking = await tx.booking.findUnique({
            where: {
                availabilityId
            },
        })

        if (existingBooking) {
            throw new Error("This slot is already booked");
        }

        const booking = await tx.booking.create({
            data: {
                serviceId,
                availabilityId,
                status: BookingStatus.REQUESTED,
                customerId
            },
            include: {
                service: true,
                availability: true,
                customer: {
                    omit: {
                        password: true,
                    }
                },
            }
        })

        // await tx.service.update({
        //     where: {
        //         id: serviceId
        //     },
        //     data: {
        //         status: ServiceStatus.ACTIVE
        //     }
        // })

        return booking
    })

    return transactionResult
}

const getAllBookings = async () => {
    const bookings = await prisma.booking.findMany({

        include: {
            service: true,
            availability: true,
            customer: {
                omit: {
                    password: true,
                }
            }
        }
    });
    return bookings;
}

const getMyBookings = async (customerId: string) => {
    const bookings = await prisma.booking.findMany({
        where: {
            customerId: customerId
        },
        include: {
            service: true,
            availability: true,
            customer: {
                omit: {
                    password: true,
                }
            }
        }
    });
    return bookings;
}

export const bookingService = {
    createBooking,
    getAllBookings,
    getMyBookings
}