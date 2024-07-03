import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { RoomModel } from "./room.model";
import { TRoom } from "./room.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { roomSearchTrams } from "./room.constant";

const getAllRoomFromDB = async (query: Record<string, unknown>) => {
  const roomQuery = new QueryBuilder(RoomModel.find(), query)
    .search(roomSearchTrams)
    .filter()
    .sort()
    .fields();

  const result = await roomQuery.modelQuery;
  return result;
};

const getSingleRoomFromDB = async (id: string) => {
  const result = await RoomModel.findOne({ _id: id });
  return result;
};

const createRoomIntroDb = async (payload: TRoom) => {
  const isAlreadyRoomNoExist = await RoomModel.findOne({
    roomNo: payload?.roomNo,
  });

  if (isAlreadyRoomNoExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Room already exists same room number"
    );
  }

  const result = await RoomModel.create(payload);
  return result;
};

const updateRoomIntroDb = async (id: string, payload: Partial<TRoom>) => {
  const isRoomExist = await RoomModel.findById(id);
  if (!isRoomExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Room not exists.");
  }

  const result = await RoomModel.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteSingleRoomFromDB = async (id: string) => {
  const result = await RoomModel.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true, runValidators: true }
  );
  return result;
};

export const RoomService = {
  getAllRoomFromDB,
  getSingleRoomFromDB,
  createRoomIntroDb,
  updateRoomIntroDb,
  deleteSingleRoomFromDB,
};
