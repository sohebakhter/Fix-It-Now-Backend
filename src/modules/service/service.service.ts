import { BookingStatus, ServiceStatus, UserRole, UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IServicePayload, IServicePayloadForUpdate } from "./service.interface";

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
            include: {
                user: true
            }
        });

        if (!technicianProfile) {
            throw new Error("Technician profile not found");
        }

        if (technicianProfile.user.status !== UserStatus.UN_BAN) {
            throw new Error("Technician user is banned");
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
            technician: true
        },
        orderBy: [
            {
                createdAt: "desc",
            },
        ]
    });
    return services;
}
const updateService = async (
    authorizedUserId: string,
    serviceId: string,
    payload: IServicePayloadForUpdate
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: authorizedUserId,
        },
        include: {
            technicianProfile: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const service = await prisma.service.findUnique({
        where: {
            id: serviceId,
        },
    });

    if (!service) {
        throw new Error("Service not found");
    }

    // Authorization
    if (user.role !== UserRole.ADMIN) {
        if (!user.technicianProfile) {
            throw new Error(
                "Only admins or technicians can update services"
            );
        }

        if (service.technicianId !== user.technicianProfile.id) {
            throw new Error("You can only update your own services");
        }
    }

    // Validate category only if categoryId is provided
    if (payload.categoryId) {
        const category = await prisma.category.findUnique({
            where: {
                id: payload.categoryId,
            },
        });

        if (!category) {
            throw new Error("Category not found");
        }
    }

    return prisma.service.update({
        where: {
            id: serviceId,
        },
        data: {
            title: payload.title,
            description: payload.description,
            price: payload.price,

            ...(payload.categoryId && {
                category: {
                    connect: {
                        id: payload.categoryId,
                    },
                },
            }),
        },
        include: {
            category: true,
        },
    });
};

const deleteService = async (
    authorizedUserId: string,
    serviceId: string
) => {
    const user = await prisma.user.findUnique({
        where: {
            id: authorizedUserId,
        },
        include: {
            technicianProfile: true,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const service = await prisma.service.findUnique({
        where: {
            id: serviceId,
        },
    });

    if (!service) {
        throw new Error("Service not found");
    }

    // Authorization
    if (user.role !== UserRole.ADMIN) {
        if (!user.technicianProfile) {
            throw new Error(
                "Only admins or technicians can delete services"
            );
        }

        if (service.technicianId !== user.technicianProfile.id) {
            throw new Error("You can only delete your own services");
        }
    }

    const deletedService = await prisma.service.delete({
        where: {
            id: serviceId,
        },
        include: {
            category: true,
        },
    });

    return deletedService;
};

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
    getMyServices,
    updateService
}