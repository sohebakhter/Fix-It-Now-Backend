import { ServiceStatus } from "../../../generated/prisma/enums";
import { ServiceWhereInput } from "../../../generated/prisma/models";

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

export interface IServiceQuery extends ServiceWhereInput {
    searchTerm?: string
    rating?: string
    limit?: string
    page?: string
    sortBy?: string
    sortOrder?: string
}