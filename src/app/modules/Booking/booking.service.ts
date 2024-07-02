import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TBooking } from "./booking.interface";
import { BookingModel } from "./booking.model";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { BookingSearchableFids } from "./booking.constant";
import { RoomModel } from "../Room/room.model";

const getAllBookingFromDB = async (query: Record<string, unknown>) => {
  const bookingQuery = new QueryBuilder(
    BookingModel.find().populate("user").populate("room"),
    query
  )
    .search(BookingSearchableFids)
    .filter()
    .sort()
    .fields();

  const result = await bookingQuery.modelQuery;
  return result;
};

const getSingleBookingFromDB = async (id: string) => {
  const result = await BookingModel.findById(id)
    .populate("user")
    .populate("room");

  return result;
};

const getUserBookingHistory = async (
  id: string,
  query: Record<string, unknown>
) => {
  const bookingQuery = new QueryBuilder(
    BookingModel.find({ user: id }).populate("user").populate("room"),
    query
  )
    .search(BookingSearchableFids)
    .filter()
    .sort()
    .fields();

  const result = await bookingQuery.modelQuery;
  return result;
};

const createBookingIntroDb = async (payload: Partial<TBooking>) => {
  // Check if the car exists and is available
  const isRoomExist = await RoomModel.findOne({
    _id: payload.room,
    isDeleted: false,
    isBooked: false,
  });

  if (!isRoomExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Room does not exist for booking");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const booking = await BookingModel.create([{ ...payload }], { session });

    const updateRoomStatusResult = await RoomModel.findByIdAndUpdate(
      payload.room,
      { isBooked: true },
      { new: true, session }
    );

    if (!updateRoomStatusResult) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Failed to update room status"
      );
    }

    const bookingId = booking[0]._id;

    // Populate the user and car fields
    const result = await BookingModel.findById(bookingId)
      .populate("user")
      .populate("room")
      .session(session)
      .exec();

    await session.commitTransaction();
    session.endSession();

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(httpStatus.BAD_REQUEST, "Failed to book a car");
  }
};

export const BookingService = {
  getAllBookingFromDB,
  getSingleBookingFromDB,
  createBookingIntroDb,
  getUserBookingHistory,
};
