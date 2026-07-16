import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs"
import { jwtHelpers } from "../../utils/jwt"
import config from "../../config"
import { Sign } from "node:crypto"
import { SignOptions } from "jsonwebtoken"
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

export const authService = {
    loginUser
}