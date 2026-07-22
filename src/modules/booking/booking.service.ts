import { BookingStatus, PaymentStatus, ServiceStatus, UserRole, UserStatus } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma"
import { IBookingPayload, IUpdateBookingStatusPayload } from "./booking.interface"

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

        const user = await tx.user.findUnique({
            where: {
                id: customerId
            }
        })

        if (!user) {
            throw new Error("User not found");
        }

        if (user.status !== UserStatus.UN_BAN) {
            throw new Error("User is banned");
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

        return booking
    })

    return transactionResult
}

const getAllBookings = async (adminId: string) => {

    const admin = await prisma.user.findUnique({
        where: {
            id: adminId,
        },
    });

    if (!admin || admin.role !== UserRole.ADMIN) {
        throw new Error('Unauthorized');
    }

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

const getMyBookings = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            technicianProfile: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    if (user.role === UserRole.CUSTOMER) {
        return await prisma.booking.findMany({
            where: {
                customerId: userId,
            },
            include: {
                customer: {
                    omit: {
                        password: true,
                    },
                },
                service: true,
                availability: true,
                payment: true,
            },
        });
    }

    if (user.role === UserRole.TECHNICIAN) {
        return await prisma.booking.findMany({
            where: {
                service: {
                    technicianId: user.technicianProfile!.id,
                },
            },
            include: {
                customer: {
                    omit: {
                        password: true,
                    },
                },
                service: true,
                availability: true,
                payment: true,
            },
        });
    }

    if (user.role === UserRole.ADMIN) {
        return await prisma.booking.findMany({
            include: {
                customer: {
                    omit: {
                        password: true,
                    },
                },
                service: true,
                availability: true,
                payment: true,
            },
        });
    }
}

const updateBookingStatus = async (authorizedUserId: string, payload: IUpdateBookingStatusPayload) => {
    const { bookingId, status } = payload;

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { service: true }
    });

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (!booking.service) {
        throw new Error("Service associated with this booking not found");
    }

    const technicianProfile = await prisma.technicianProfile.findUnique({
        where: { userId: authorizedUserId }
    });

    if (booking.service.technicianId !== technicianProfile?.id) {
        throw new Error("Unauthorized: Only the assigned technician can update this booking");
    }

    let nextStatus: BookingStatus | null = null;

    if (booking.status === BookingStatus.REQUESTED && status === BookingStatus.ACCEPTED) {
        nextStatus = BookingStatus.ACCEPTED;
    } else if (booking.status === BookingStatus.PAID && status === BookingStatus.IN_PROGRESS) {
        nextStatus = BookingStatus.IN_PROGRESS;
    }
    else if (booking.status === BookingStatus.IN_PROGRESS && status === BookingStatus.COMPLETED) {
        nextStatus = BookingStatus.COMPLETED;
    } else {
        throw new Error(`Invalid status transition from ${booking.status} to ${status}`);
    }

    const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: { status: nextStatus },
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

    return updatedBooking;
};

const cancelBooking = async (authorizedUserId: string, bookingId: string) => {

    const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: { payment: true }
    });

    if (!booking) {
        throw new Error("Booking not found");
    }

    if (booking.customerId !== authorizedUserId) {
        throw new Error("Unauthorized: You can only cancel your own booking");
    }

    const nonCancellableStatuses: BookingStatus[] = [
        BookingStatus.IN_PROGRESS,
        BookingStatus.COMPLETED,
        BookingStatus.DECLINED,
        BookingStatus.CANCELLED
    ];

    if (nonCancellableStatuses.includes(booking.status)) {
        throw new Error(`Booking cannot be cancelled because it is already ${booking.status.toLowerCase()}`);
    }

    const result = await prisma.$transaction(async (tx) => {

        const updatedBooking = await tx.booking.update({
            where: { id: bookingId },
            data: { status: BookingStatus.CANCELLED }
        });


        if (booking.payment?.status === PaymentStatus.PAID) {
            await tx.payment.update({
                where: { bookingId },
                data: { status: PaymentStatus.REFUNDED }
            });
        }

        return updatedBooking;
    });

    return result;
};


export const bookingService = {
    createBooking,
    getAllBookings,
    getMyBookings,
    updateBookingStatus,
    cancelBooking
}