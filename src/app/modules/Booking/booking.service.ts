import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TBooking } from "./booking.interface";
import { BookingModel } from "./booking.model";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { BOOKING_STATUS, BookingSearchableFids } from "./booking.constant";
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

const checkInBookingIntoDb = async (id: string) => {
  const isBookingExist = await BookingModel.findById(id);
  if (!isBookingExist) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking not exists.");
  }

  const currentDate = new Date().toISOString().split("T")[0];

  const bookingUpdateData = {
    bookingStatus: BOOKING_STATUS.checkOut,
    checkInAt: currentDate,
  };

  const result = await BookingModel.findByIdAndUpdate(id, bookingUpdateData, {
    new: true,
  });
  return result;
};

const checkOutBookingIntoDb = async (id: string) => {
  const bookingData = await BookingModel.findById(id);
  if (!bookingData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking not exists.");
  }

  const roomData = await RoomModel.findById(bookingData.room).select(
    "pricePerNight"
  );

  const currentDate = new Date().toISOString().split("T")[0];
  const checkInAt = bookingData?.checkInAt as string;

  const date1 = new Date(checkInAt);
  const date2 = new Date(currentDate);

  const time1 = date1.getTime();
  const time2 = date2.getTime();

  const differenceInTime = time1 - time2;
  const differenceInDays = differenceInTime / (1000 * 3600 * 24);

  const totalCost = differenceInDays * (roomData?.pricePerNight as number);

  const bookingUpdateData = {
    bookingStatus: BOOKING_STATUS.checkOut,
    checkOutAt: currentDate,
    totalCost: totalCost,
  };

  const result = await BookingModel.findByIdAndUpdate(id, bookingUpdateData, {
    new: true,
  });
  return result;
};

const cancellingBookingIntoDb = async (id: string) => {
  const bookingRoom = await BookingModel.findById(id);
  if (!bookingRoom) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking not exists.");
  }

  if (bookingRoom?.bookingStatus === BOOKING_STATUS.checkIn) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Booking Cancel not allowed when booking status checkIn."
    );
  }

  if (bookingRoom?.bookingStatus === BOOKING_STATUS.checkOut) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Cancel now allowed this booking already checked out."
    );
  }

  const currentDate = new Date().toISOString().split("T")[0];

  const bookingUpdateData = {
    bookingStatus: BOOKING_STATUS.cancelled,
    cancelledAt: currentDate,
  };

  const result = await BookingModel.findByIdAndUpdate(id, bookingUpdateData, {
    new: true,
  });
  return result;
};

export const BookingService = {
  getAllBookingFromDB,
  getSingleBookingFromDB,
  createBookingIntroDb,
  getUserBookingHistory,
  checkInBookingIntoDb,
  checkOutBookingIntoDb,
  cancellingBookingIntoDb,
};
