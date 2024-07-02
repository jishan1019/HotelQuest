import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { RoomModel } from "./room.model";
import { TRoom } from "./room.interface";

const getAllRoomFromDB = async () => {
  const result = await RoomModel.find();
  return result;
};

const getSingleRoomFromDB = async (id: string) => {
  const result = await RoomModel.findOne({ _id: id });
  return result;
};

const createRoomIntroDb = async (payload: TRoom) => {
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
