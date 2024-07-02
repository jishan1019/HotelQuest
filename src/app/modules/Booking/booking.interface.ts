import { Types } from "mongoose";
import { TRoom } from "../Room/room.interface";
import { TUser } from "../User/user.interface";

export type TBookingStatus = "booked" | "checkIn" | "checkOut" | "cancelled";

export type TBooking = {
  user: Types.ObjectId;
  room: Types.ObjectId;
  bookedAt: string;
  checkInAt?: string;
  checkOutAt?: string;
  cancelledAt?: string;
  totalCost?: number;
  bookingStatus: TBookingStatus;
};

export type TPopulatedBooking = TBooking & {
  room: TRoom;
} & {
  user: TUser;
};
