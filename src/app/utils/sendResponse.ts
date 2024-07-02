import { Response } from "express";

type TResponse<T> = {
  statusCode: number;
  success: boolean;
  message?: string;
  data: T;
  token?: string;
};

const sendResponse = <T>(res: Response, data: TResponse<T>) => {
  const responseData = {
    success: data.success,
    message: data.message,
    data: data.data,
    token: data?.token,
  };

  if (!data?.token) {
    delete responseData.token;
  }

  res.status(data.statusCode).json({ responseData });
};

export default sendResponse;
