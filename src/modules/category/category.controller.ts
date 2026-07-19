import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { categoryService } from "./category.service";


const createCategory = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id
    const payload = req.body;
    const newCategory = await categoryService.createCategory(adminId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Category created successfully',
        data: newCategory
    });
})

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Categories fetched successfully',
        data: categories
    });
})

const updateCategory = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id
    const categoryId = req.params.categoryId
    const payload = req.body
    const updatedCategory = await categoryService.updateCategory(adminId as string, categoryId as string, payload)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Category updated successfully',
        data: updatedCategory
    });
})

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id
    const categoryId = req.params.categoryId
    const deletedCategory = await categoryService.deleteCategory(adminId as string, categoryId as string)
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Category deleted successfully',
        data: deletedCategory
    });
})


export const categoryController = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory
}