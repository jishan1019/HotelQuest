import { TBookingStatus } from "./booking.interface";

export const BookingStatus: TBookingStatus[] = [
  "booked",
  "checkIn",
  "checkOut",
  "canceled",
];

export const BOOKING_STATUS = {
  booked: "booked",
  checkIn: "checkIn",
  checkOut: "checkOut",
  canceled: "canceled",
} as const;
