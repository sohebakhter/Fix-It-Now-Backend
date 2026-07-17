import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IServicePayload } from "./service.interface";

const createService = async (userId: string, payload: IServicePayload) => {
    const category = await prisma.category.findUnique({
        where: {
            id: payload.categoryId,
        },
    });

    if (!category) {
        throw new Error("Category not found");
    }

    const technicianProfile = await prisma.technicianProfile.findUnique({
        where: {
            userId: userId,
        },
    });

    if (!technicianProfile) {
        throw new Error("Technician profile not found");
    }

    const service = await prisma.service.create({
        data: {
            ...payload,
            technicianId: technicianProfile.id,
        },
        include: {
            category: true,
        },
    });

    return service
}

const getAllServices = async () => {
    const services = await prisma.service.findMany({
        include: {
            category: true,
        }
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


export const serviceService = {
    createService,
    getAllServices,
    deleteService
}