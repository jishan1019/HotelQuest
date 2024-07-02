import { Schema, model } from "mongoose";
import { TBooking } from "./booking.interface";
import { BOOKING_STATUS, BookingStatus } from "./booking.constant";

const bookingSchema = new Schema<TBooking>(
  {
    bookedAt: {
      type: String,
      required: [true, "Booking Start Time is required"],
    },
    checkInAt: {
      type: String,
      default: null,
    },
    checkOutAt: {
      type: String,
      default: null,
    },
    canceledAt: {
      type: String,
      default: null,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "User Id is required"],
      ref: "User",
    },
    room: {
      type: Schema.Types.ObjectId,
      required: [true, "Room Id is required"],
      ref: "Room",
    },

    totalCost: {
      type: Number,
      default: 0,
    },
    bookingStatus: {
      type: String,
      enum: {
        values: BookingStatus,
        message: "{VALUE} is not a valid booking status",
      },
      required: [true, "Booking Status is required"],
      default: BOOKING_STATUS.booked,
    },
  },
  {
    timestamps: true,
  }
);

const BookingModel = model<TBooking>("Booking", bookingSchema);

export { BookingModel };
