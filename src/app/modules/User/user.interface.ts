import { Model } from "mongoose";

export type TRole = "user" | "admin";

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: TRole;
  phone: string;
  address: string;
  isDeleted: boolean;
};

export interface TUserModel extends Model<TUser> {
  isUserExistsByCustomId(id: string): Promise<TUser>;
  isPasswordMatch(dbUserPass: string, payloadPass: string): Promise<boolean>;
}
