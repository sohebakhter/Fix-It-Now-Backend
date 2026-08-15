import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs"
import { jwtHelpers } from "../../utils/jwt"
import config from "../../config"
import { JwtPayload, SignOptions } from "jsonwebtoken"
import { ILoginUserPayload } from "./auth.interface"
import nodemailer from "nodemailer"

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

const sendOtp = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (!user) {
        throw new Error('User not found')
    }
    const generateOtp = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    };
    const otp = generateOtp();

    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            resetOtp: otp,
            otpExpiry: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now
        }
    })

    const sendEmail = (email: string, otp: string) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.app_email,
                pass: config.app_password,
            },
        });

        const mailOptions = {
            from: config.app_email,
            to: email,
            subject: "Password Reset OTP",
            text: `Your password reset OTP is ${otp}. This OTP will expire in 5 minutes. If you did not request a password reset, please ignore this email.`,
            html: `
              <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Password Reset Request</h2>
            <p>Use the OTP below to reset your password:</p>

            <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">
            ${otp}
            </div>

            <p>This OTP will expire in <strong>5 minutes</strong>.</p>

            <p>
            If you did not request a password reset, please ignore this email.
            </p>

           <p>Thanks,<br />FixItNow Team</p>
           </div>
           `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    };

    sendEmail(email, otp);

}


const verifyOtp = async (email: string, otp: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (!user) {
        throw new Error('User not found')
    }
    if (user.resetOtp !== otp) {
        throw new Error('Invalid OTP')
    }
    if (user.otpExpiry! < new Date()) {
        throw new Error('OTP expired')
    }
}


const resetPassword = async (email: string, otp: string, password: string) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (!user) {
        throw new Error('User not found')
    }
    if (user.resetOtp !== otp) {
        throw new Error('Invalid OTP')
    }
    if (user.otpExpiry! < new Date()) {
        throw new Error('OTP expired')
    }
    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt))
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            password: hashedPassword,
            resetOtp: null,
            otpExpiry: null
        }
    })

}

export const authService = {
    loginUser,
    refreshToken,
    sendOtp,
    verifyOtp,
    resetPassword
}