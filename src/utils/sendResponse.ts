import { Response } from "express"

type TMeta = {
    page: number
    size?: number
    limit: number
    total: number
    totalPages?: number
}

type TResponseData<T> = {
    success: boolean,
    statusCode: number,
    message: string,
    data: T,
    meta?: TMeta
}

export const sendResponse = <T>(res: Response, data: TResponseData<T>) => {
    return res.status(data.statusCode).json({
        success: data.success,
        status: data.statusCode,
        message: data.message,
        data: data.data,
        meta: data.meta
    })
}

