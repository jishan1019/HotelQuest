import { Schema, model } from "mongoose";
import { RoomType } from "./room.constant";
import { TRoom } from "./room.interface";

const roomSchema = new Schema<TRoom>(
  {
    roomNo: {
      type: Number,
      required: [true, "Room No is require"],
    },
    type: {
      type: String,
      enum: {
        values: RoomType,
        message: "{VALUE} is not a valid room type",
      },
      required: [true, "Room type is require"],
    },
    description: {
      type: String,
      required: [true, "Room description is require"],
    },
    pricePerNight: {
      type: Number,
      required: [true, "Room Price Per Night is require"],
    },
    isBooked: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const RoomModel = model<TRoom>("Room", roomSchema);

export { RoomModel };
