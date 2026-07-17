import { prisma } from "../../lib/prisma"
import { ICategoryPayload } from "./category.interface"

const createCategory = async (payload: ICategoryPayload) => {

    const category = await prisma.category.create({
        data: payload
    })

    return category
}

const getAllCategories = async () => {
    const categories = await prisma.category.findMany()
    return categories
}

export const categoryService = {
    createCategory,
    getAllCategories
}