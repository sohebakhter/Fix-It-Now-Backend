import config from "../../config"
import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs"
import { IRegisterUserPayload } from "./user.interface"

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

const getMyProfile = () => { }

const updateMyProfile = () => { }

const deleteMyProfile = () => { }

export const userService = {
    registerUser,
    getMyProfile,
    updateMyProfile,
    deleteMyProfile
}