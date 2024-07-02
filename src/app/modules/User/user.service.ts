import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { UserModel } from "./user.model";
import { TUser } from "./user.interface";

const getAllUserFromDB = async () => {
  const result = await UserModel.find();
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const user = await UserModel.isUserExistsByCustomId(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const updateUserIntroDb = async (id: string, payload: Partial<TUser>) => {
  const user = await UserModel.isUserExistsByCustomId(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await UserModel.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteSingleUserFromDB = async (id: string) => {
  const user = await UserModel.isUserExistsByCustomId(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const result = await UserModel.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );

  return result;
};

export const UserService = {
  getAllUserFromDB,
  getSingleUserFromDB,
  updateUserIntroDb,
  deleteSingleUserFromDB,
};
