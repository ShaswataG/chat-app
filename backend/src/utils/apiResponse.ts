export const successResponse = (data: any, message = 'Success') => ({
    success: true,
    message,
    data,
});

export const errorResponse = (message: string, statusCode = 500) => ({
    success: false,
    message,
    statusCode,
});
