import { UserModel } from "./user.model";

const getAllUserFromDb = async (query: Record<string, unknown>) => {
  const result = await UserModel.find();
  return result;
};

export const UserService = {
  getAllUserFromDb,
};
