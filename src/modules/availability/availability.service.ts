import { prisma } from "../../lib/prisma";
import { IAvailabilityPayload } from "./availability.interface";

const createAvailability = async (technicianId: string, payload: IAvailabilityPayload) => {
    // Implementation for creating availability
    const technicianProfile = await prisma.technicianProfile.findUnique({
        where: {
            userId: technicianId
        }
    });

    if (!technicianProfile) {
        throw new Error("Technician profile not found");
    }

    const existingAvailability = await prisma.availability.findMany({
        where: {
            technicianId: technicianProfile.id,
            date: payload.date
        }
    });

    if (payload.startTime >= payload.endTime) {
        throw new Error("Start time must be earlier than end time");
    }

    if (existingAvailability.some(avail => (avail.startTime < payload.endTime && avail.endTime > payload.startTime))) {
        throw new Error("Availability overlaps with existing availability");
    }


    const newAvailability = await prisma.availability.create({
        data: {
            ...payload,
            technicianId: technicianProfile.id
        },
        include: {
            technicianProfile: true
        }
    });

    return newAvailability
};

const getAllAvailabilities = async () => {
    const availabilities = await prisma.availability.findMany({
        include: {
            technicianProfile: true
        }
    });
    return availabilities;
}

export const availabilityService = {
    createAvailability,
    getAllAvailabilities
}