import config from "../../config"
import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs"
import { IRegisterUserPayload, IUpdateUserPayload } from "./user.interface"

const registerUser = async (payload: IRegisterUserPayload) => {

    const isUserExist = await prisma.user.findUnique({
        where: {
            email: payload.email
        }
    })

    if (isUserExist) {
        throw new Error('User already exist')
    }

    const {
        experience,
        rating,
        password,
        ...userData
    } = payload;

    const hashPassword = await bcrypt.hash(
        password,
        Number(config.bcrypt_salt)
    );

    const createdUser = await prisma.user.create({
        data: {
            ...userData,
            password: hashPassword,

            technicianProfile: {
                create: {
                    experience: experience ?? 0,
                    rating: rating ?? 0,
                },
            },
        },
    });

    const user = await prisma.user.findUnique({
        where: {
            id: createdUser.id,
            email: createdUser.email
        },
        omit: {
            password: true
        },
        include: {
            technicianProfile: true
        }
    })

    return user
}

const getMyProfile = (userId: string) => {
    const user = prisma.user.findUnique({
        where: {
            id: userId
        },
        omit: {
            password: true
        },
        include: {
            technicianProfile: true
        }
    })

    if (!user) {
        throw new Error('User not found')
    }

    return user
}

const updateMyProfile = async (userId: string, payload: IUpdateUserPayload) => {

    const { name, experience } = payload

    const isUser = await prisma.user.findUnique({
        where: {
            id: userId
        }, include: {
            technicianProfile: true
        }
    })

    if (!isUser) {
        throw new Error('User not found')
    }

    const user = await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            name,
            technicianProfile: {
                update: {
                    experience,
                },
            },
        },
        include: {
            technicianProfile: true,
        },
    });

    return user
}

const deleteMyProfile = async (userId: string) => {

    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if (!user) {
        throw new Error('User not found')
    }

    const isOwn = user.id === userId

    if (!isOwn) {
        throw new Error('You can only delete your own profile')
    }

    return prisma.user.delete({
        where: {
            id: userId
        }
    })
}

export const userService = {
    registerUser,
    getMyProfile,
    updateMyProfile,
    deleteMyProfile
}