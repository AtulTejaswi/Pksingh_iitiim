export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string | object;
}

export const successResponse = <T>(data: T): ApiResponse<T> => {
  return {
    success: true,
    data,
  };
};

export const errorResponse = (error: string | object): ApiResponse<null> => {
  return {
    success: false,
    error,
  };
};
