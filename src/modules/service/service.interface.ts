import { ServiceStatus } from "../../../generated/prisma/enums";

export interface IServicePayloadForUpdate {
    categoryId?: string;
    title?: string;
    description?: string;
    location?: string;
    price?: number;
    status?: ServiceStatus;
}

export interface IServicePayload {
    categoryId: string;
    title: string;
    description?: string;
    location: string;
    price: number;
    status: ServiceStatus;
}