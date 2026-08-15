
import { UserRole, UserStatus } from "../../../generated/prisma/enums";

export interface IRegisterUserPayload {
    name: string;
    image: string;
    email: string;
    password: string;
    role?: UserRole;

    experience?: number;
    rating?: number;
}
export interface IUpdateUserPayload {
    name?: string;
    image?: string;
    experience?: number;
}
export interface IUpdateUserPayloadForAdmin {
    name?: string;
    password?: string;
    role?: UserRole;
    status?: UserStatus
    experience?: number;
    rating?: number;
}