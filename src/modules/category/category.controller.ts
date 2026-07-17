import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { Request, Response } from "express";
import { categoryService } from "./category.service";


const createCategory = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;
    const newCategory = await categoryService.createCategory(payload);

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


export const categoryController = {
    createCategory,
    getAllCategories
}