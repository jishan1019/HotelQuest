import { Types } from "mongoose";

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
