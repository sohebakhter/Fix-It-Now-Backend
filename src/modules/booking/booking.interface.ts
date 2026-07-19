import { BookingStatus } from "../../../generated/prisma/enums";

export interface IBookingPayload {
    serviceId: string;
    availabilityId: string;
    status?: BookingStatus;
}

export interface IUpdateBookingStatusPayload {
    bookingId: string;
    status: BookingStatus;
}