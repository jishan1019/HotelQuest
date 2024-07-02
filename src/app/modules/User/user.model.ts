import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import { Role, USER_ROLE } from "./user.constant";

const userSchema = new Schema<TUser>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: 0,
  },
  role: {
    type: String,
    enum: {
      values: Role,
      message: "{VALUE} is not a valid role",
    },
    required: [true, "Role is required"],
    default: USER_ROLE.user,
  },
  phone: {
    type: String,
    required: [true, "Phone is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const UserModel = model<TUser>("user", userSchema);

export { UserModel };
