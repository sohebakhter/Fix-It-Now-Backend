import { NextFunction, Request, Response } from "express"
import { UserRole } from "../../generated/prisma/enums"
import { jwtHelpers } from "../utils/jwt"
import config from "../config"
import { JwtPayload } from "jsonwebtoken"
import { catchAsync } from "../utils/catchAsync"
import { prisma } from "../lib/prisma"

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string
                email: string
                role: UserRole
            }
        }
    }
}

const auth = (...userRoles: UserRole[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies.accessToken ? req.cookies.accessToken : req.headers.authorization?.split("Bearer ")[1] ? req.headers.authorization?.split("Bearer ")[1] : req.headers.authorization?.split(" ")[1] ? req.headers.authorization?.split(" ")[1] : req.headers.authorization

        if (!token) {
            throw new Error("You are not logged in")
        }

        const verifiedToken = jwtHelpers.verifyToken(token, config.jwt_access_secret as string)

        if (!verifiedToken.success) {
            throw new Error(verifiedToken.error)
        }

        const { id, email, role } = verifiedToken.data as JwtPayload

        if (userRoles.length && !userRoles.includes(role)) {
            throw new Error("You are not authorized to access this route")
        }

        const user = await prisma.user.findUnique({
            where: {
                id
            }
        })

        if (!user) {
            throw new Error("User not found")
        }

        if (user.status === 'BAN') {
            throw new Error("You are banned")
        }

        req.user = {
            id,
            email,
            role
        }

        next()
    })
}

export default auth