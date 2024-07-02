import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { RoomService } from "./Room.service";

const getAllRoom = catchAsync(async (req, res) => {
  const result = await RoomService.getAllRoomFromDB();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rooms retrieved successfully",
    data: result,
  });
});

const getSingleRoom = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoomService.getSingleRoomFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "A Room retrieved successfully",
    data: result,
  });
});

const createRoom = catchAsync(async (req, res) => {
  const result = await RoomService.createRoomIntroDb(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Room created successfully",
    data: result,
  });
});

const updateRoom = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoomService.updateRoomIntroDb(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room updated successfully",
    data: result,
  });
});

const deleteRoom = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await RoomService.deleteSingleRoomFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room Deleted successfully",
    data: result,
  });
});

export const RoomController = {
  getAllRoom,
  getSingleRoom,
  createRoom,
  updateRoom,
  deleteRoom,
};
