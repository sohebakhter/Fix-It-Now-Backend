import { prisma } from "../../lib/prisma"

const getTechnicians = async () => {
    const technicians = await prisma.technicianProfile.findMany({
        include: {
            user: {
                omit: {
                    password: true
                }
            }
        }
    })
    return technicians
}

export const technicianProfileService = {
    getTechnicians
}