import { UserRole } from "../../../generated/prisma/enums"
import { prisma } from "../../lib/prisma"
import { ICategoryPayload } from "./category.interface"

const createCategory = async (adminId: string, payload: ICategoryPayload) => {

    const admin = await prisma.user.findUnique({
        where: {
            id: adminId
        }
    })

    if (!admin || admin.role !== UserRole.ADMIN) {
        throw new Error('Only admins can perform this action')
    }

    const category = await prisma.category.create({
        data: payload
    })

    return category
}

const getAllCategories = async () => {
    const categories = await prisma.category.findMany()
    return categories
}

const updateCategory = async (adminId: string, categoryId: string, payload: ICategoryPayload) => {

    const admin = await prisma.user.findUnique({
        where: {
            id: adminId
        }
    })

    if (!admin || admin.role !== UserRole.ADMIN) {
        throw new Error('Only admins can perform this action')
    }

    const category = await prisma.category.update({
        where: {
            id: categoryId
        },
        data: payload
    })

    return category
}



const deleteCategory = async (adminId: string, categoryId: string) => {

    const admin = await prisma.user.findUnique({
        where: {
            id: adminId
        }
    })

    if (!admin || admin.role !== UserRole.ADMIN) {
        throw new Error('Only admins can perform this action')
    }

    await prisma.category.delete({
        where: {
            id: categoryId
        }
    })

    return null
}

export const categoryService = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
}