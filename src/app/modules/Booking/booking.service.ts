import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TBooking } from "./booking.interface";
import { BookingModel } from "./booking.model";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";
import { BOOKING_STATUS, BookingSearchableFids } from "./booking.constant";
import { RoomModel } from "../Room/room.model";
import { startSession } from "mongoose";

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
  const bookingData = await BookingModel.findById(id);
  if (!bookingData) {
    throw new AppError(httpStatus.BAD_REQUEST, "Booking not exists.");
  }

  if (
    bookingData?.bookingStatus === BOOKING_STATUS.checkOut ||
    bookingData?.bookingStatus === BOOKING_STATUS.cancelled
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      `Booking already ${bookingData?.bookingStatus}`
    );
  }

  const currentDate = new Date().toISOString().split("T")[0];

  const bookingUpdateData = {
    bookingStatus: BOOKING_STATUS.checkIn,
    checkInAt: currentDate,
  };

  const result = await BookingModel.findByIdAndUpdate(id, bookingUpdateData, {
    new: true,
  });
  return result;
};

const checkOutBookingIntoDb = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bookingData = await BookingModel.findById(id).session(session);
    if (!bookingData) {
      throw new AppError(httpStatus.BAD_REQUEST, "Booking not exists.");
    }

    if (bookingData?.bookingStatus === BOOKING_STATUS.booked) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cannot update bookings booked to checkout"
      );
    }

    if (bookingData?.bookingStatus === BOOKING_STATUS.cancelled) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        `Booking already ${bookingData?.bookingStatus}`
      );
    }

    const roomData = await RoomModel.findById(bookingData.room)
      .select("pricePerNight")
      .session(session);

    const currentDate = new Date().toISOString().split("T")[0];
    const checkInAt = bookingData?.checkInAt as string;

    const date1 = new Date(checkInAt);
    const date2 = new Date(currentDate);

    const time1 = date1.getTime();
    const time2 = date2.getTime();

    const differenceInTime = time2 - time1;
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    const totalCost = differenceInDays * (roomData?.pricePerNight as number);

    const bookingUpdateData = {
      bookingStatus: BOOKING_STATUS.checkOut,
      checkOutAt: currentDate,
      totalCost: totalCost,
    };

    await BookingModel.findByIdAndUpdate(id, bookingUpdateData, {
      new: true,
      session,
    });

    await RoomModel.findByIdAndUpdate(
      roomData?._id,
      { isBooked: false },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    const result = await BookingModel.findById(id)
      .populate("user")
      .populate("room");

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Failed to update checkout status"
    );
  }
};

const cancellingBookingIntoDb = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const bookingRoom = await BookingModel.findById(id).session(session);

    if (!bookingRoom) {
      throw new AppError(httpStatus.BAD_REQUEST, "Booking not exists.");
    }

    if (bookingRoom?.bookingStatus === BOOKING_STATUS.checkIn) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Booking Cancel not allowed when booking status is checkIn."
      );
    }

    if (bookingRoom?.bookingStatus === BOOKING_STATUS.checkOut) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "Cancel not allowed for this booking as it is already checked out."
      );
    }

    const currentDate = new Date().toISOString().split("T")[0];

    const bookingUpdateData = {
      bookingStatus: BOOKING_STATUS.cancelled,
      cancelledAt: currentDate,
    };

    const updateResult = await BookingModel.findByIdAndUpdate(
      id,
      bookingUpdateData,
      { new: true, session }
    );

    await RoomModel.findByIdAndUpdate(
      bookingRoom?.room,
      { isBooked: false },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    const result = await BookingModel.findById(id)
      .populate("user")
      .populate("room");

    return result;
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    throw new AppError(httpStatus.BAD_REQUEST, error);
  }
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
