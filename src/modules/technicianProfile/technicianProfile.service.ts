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

const getTechnicianProfile = async (technicianId: string) => {
    const technician = await prisma.technicianProfile.findUnique({
        where: {
            id: technicianId,
        },
        include: {
            user: {
                omit: {
                    password: true,
                },
            },
            services: {
                include: {
                    reviews: true,
                },
            },
        },
    });
    return technician
}

export const technicianProfileService = {
    getTechnicians,
    getTechnicianProfile
}