import { BookingStatus, ServiceStatus, UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IServicePayload } from "./service.interface";

const createService = async (userId: string, payload: IServicePayload) => {
    const transactionResult = await prisma.$transaction(async (tx) => {

        const category = await tx.category.findUnique({
            where: {
                id: payload.categoryId,
            },
        });

        if (!category) {
            throw new Error("Category not found");
        }

        const technicianProfile = await tx.technicianProfile.findUnique({
            where: {
                userId: userId,
            },
        });

        if (!technicianProfile) {
            throw new Error("Technician profile not found");
        }

        const service = await tx.service.create({
            data: {
                ...payload,
                technicianId: technicianProfile.id,
                status: ServiceStatus.ACTIVE
            },
            include: {
                category: true,
            },
        });

        return service

    })

    return transactionResult

}

const getAllServices = async () => {
    const services = await prisma.service.findMany({
        include: {
            category: true,
        },
        orderBy: [
            {
                createdAt: "desc",
            },
        ]
    });
    return services;
}

const deleteService = async (authorizedUserId: string, serviceId: string) => {

    const technicianProfile = await prisma.technicianProfile.findUnique({
        where: {
            userId: authorizedUserId,
        },
    });

    const user = await prisma.user.findUnique({
        where: {
            id: authorizedUserId,
        },
    });

    if (user?.role !== UserRole.ADMIN && !technicianProfile) {
        throw new Error("Only admins can delete services or technicians can delete their own services");
    }

    const service = await prisma.service.findUnique({
        where: {
            id: serviceId,
        },
    });

    if (!service) {
        throw new Error("Service not found");
    }


    await prisma.service.delete({
        where: {
            id: serviceId,
        },
        include: {
            category: true,
        }
    })

    return null;
}

const getMyServices = async (userId: string) => {

    const technicianProfile = await prisma.technicianProfile.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!technicianProfile) {
        throw new Error("Technician profile not found");
    }

    const services = await prisma.service.findMany({
        where: {
            technicianId: technicianProfile.id,
        },
        include: {
            category: true,
            bookings: {
                where: {
                    status: BookingStatus.REQUESTED
                }
            }
        },
        orderBy: [
            {
                createdAt: "desc",
            },
        ]
    });
    return services;
}


export const serviceService = {
    createService,
    getAllServices,
    deleteService,
    getMyServices
}