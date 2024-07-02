import { TBookingStatus } from "./booking.interface";

export const BookingStatus: TBookingStatus[] = [
  "booked",
  "checkIn",
  "checkOut",
  "cancelled",
];

export const BookingSearchableFids = [
  "user",
  "room",
  "bookedAt",
  "checkInAt",
  "checkOutAt",
  "cancelledAt",
  "totalCost",
  "bookingStatus",
];

export const BOOKING_STATUS = {
  booked: "booked",
  checkIn: "checkIn",
  checkOut: "checkOut",
  cancelled: "cancelled",
} as const;
