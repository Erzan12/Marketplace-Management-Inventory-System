export const successResponse = (message: string, data: any = null) => ({
  status: 'success',
  message,
  data,
});

export const errorResponse = (message: string, error: any = null) => ({
  status: 'error',
  message,
  error,
});

export function buildErrorResponse(
  message: string,
  error: string,
  statusCode: number,
) {
  return {
    statusCode,
    message,
    error,
  };
}
