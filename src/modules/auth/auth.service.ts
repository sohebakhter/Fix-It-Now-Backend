import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs"
import { jwtHelpers } from "../../utils/jwt"
import config from "../../config"
import { Sign } from "node:crypto"
import { JwtPayload, SignOptions } from "jsonwebtoken"
import { ILoginUserPayload } from "./auth.interface"

const loginUser = async (payload: ILoginUserPayload) => {
    const { email, password } = payload
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if (!user) {
        throw new Error('User not found')
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
        throw new Error('Invalid password')
    }

    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role
    }

    const accessToken = jwtHelpers.createToken(jwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as SignOptions);
    const refreshToken = jwtHelpers.createToken(jwtPayload, config.jwt_refresh_secret as string, config.jwt_refresh_expires_in as SignOptions);

    return { accessToken, refreshToken };


}

const refreshToken = async (token: string) => {
    const verifiedToken = jwtHelpers.verifyToken(token, config.jwt_refresh_secret as string)

    if (!verifiedToken.success) {
        throw new Error('Invalid refresh token')
    }

    const { id, } = verifiedToken.data as JwtPayload

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!user) {
        throw new Error('User not found')
    }

    if (user.status === "BAN") {
        throw new Error('User is banned')
    }

    const jwtPayload = {
        id: user?.id,
        email: user?.email,
        role: user?.role
    }

    const newAccessToken = jwtHelpers.createToken(jwtPayload as JwtPayload, config.jwt_access_secret as string, config.jwt_access_expires_in as SignOptions);

    return newAccessToken;
}

export const authService = {
    loginUser,
    refreshToken
}