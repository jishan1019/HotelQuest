import { Schema, model } from "mongoose";
import { TUser, TUserModel } from "./user.interface";
import { Role, USER_ROLE } from "./user.constant";
import argon2 from "argon2";

const userSchema = new Schema<TUser, TUserModel>({
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

userSchema.pre("save", async function (next) {
  try {
    const hash = await argon2.hash(this.password);
    this.password = hash;

    next();
  } catch (err: any) {
    next(err);
  }
});

userSchema.post("save", function (user, next) {
  user.password = "";
});

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
  return await this.findOne({ _id: id, isDeleted: false }).select("+password");
};

userSchema.statics.isPasswordMatch = async function (dbUserPass, payloadPass) {
  return await argon2.verify(dbUserPass, payloadPass);
};

const UserModel = model<TUser, TUserModel>("User", userSchema);

export { UserModel };
