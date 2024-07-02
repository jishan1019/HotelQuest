import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  token?: string;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  if (
    (Array.isArray(data.data) && data.data?.length === 0) ||
    Object.keys(data)?.length === 0 ||
    !data.data
  ) {
    data.statusCode = 404;
    data.success = false;
    data.message = "No Data Found";
  }

  const response = {
    success: data.success,
    message: data.message,
    data: data.data,
    token: data.token,
  };

  if (!data.token) {
    delete response.token;
  }

  res.status(data.statusCode).json({
    response,
  });
};

export default sendResponse;
