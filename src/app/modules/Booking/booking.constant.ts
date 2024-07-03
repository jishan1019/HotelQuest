import { TBookingStatus } from "./booking.interface";

export const BookingStatus: TBookingStatus[] = [
  "booked",
  "checkIn",
  "checkOut",
  "cancelled",
];

export const BookingSearchableFids = [
  "user.email",
  "user.name",
  "user.address",
  "user.phone",
  "room.type",
  "room.description",
  "bookedAt",
  "checkInAt",
  "checkOutAt",
  "cancelledAt",
  "bookingStatus",
];

export const BOOKING_STATUS = {
  booked: "booked",
  checkIn: "checkIn",
  checkOut: "checkOut",
  cancelled: "cancelled",
} as const;
