import { prisma } from "../../lib/prisma";
import { IServicePayload } from "./service.interface";

const createService = async (technicianId: string, payload: IServicePayload) => {
    const category = await prisma.category.findUnique({
        where: {
            id: payload.categoryId,
        },
    });

    if (!category) {
        throw new Error("Category not found");
    }

    const service = await prisma.service.create({
        data: {
            ...payload,
            technicianId
        },
        include: {
            category: true,
        },
    });

    return service
}

const getAllServices = () => { }

export const serviceService = {
    createService,
    getAllServices
}