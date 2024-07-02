import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserService } from "./user.service";

const getAllUser = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await UserService.getAllUserFromDb(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All User is retrieved successfully",
    data: result,
  });
});

export const UserController = {
  getAllUser,
};
