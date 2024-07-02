import { Types } from "mongoose";

export type TBookingStatus = "booked" | "checkIn" | "checkOut" | "canceled";

export type TBooking = {
  user: Types.ObjectId;
  room: Types.ObjectId;
  bookedAt: string;
  checkInAt?: string;
  checkOutAt?: string;
  canceledAt?: string;
  totalCost?: number;
  bookingStatus: TBookingStatus;
};
