import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { TBooking } from "./booking.interface";
import { BookingModel } from "./booking.model";
import mongoose from "mongoose";
import { BOOKING_STATUS } from "./booking.constant";
import QueryBuilder from "../../builder/QueryBuilder";

const getAllBookingFromDB = async (query: Record<string, unknown>) => {
  const bookingQuery = new QueryBuilder(
    BookingModel.find().populate("user").populate("room"),
    query
  )
    .search([])
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

const getUserBookingHistory = async (id: string) => {
  const result = await BookingModel.find({
    user: id,
    bookingStatus: BOOKING_STATUS.returned,
  })
    .populate("user")
    .populate("car");

  return result;
};

const createBookingIntroDb = async (payload: Partial<TBooking>) => {
  // Check if the car exists and is available
  const isCarExist = await CarModel.findOne({
    _id: payload.car,
    isDeleted: false,
    status: CarBookingStatus.AVAILABLE,
  });

  if (!isCarExist) {
    throw new AppError(httpStatus.NOT_FOUND, "Car does not exist for booking");
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const booking = await BookingModel.create([{ ...payload }], { session });

    const updateCarStatusResult = await CarModel.findByIdAndUpdate(
      payload.car,
      { status: CarBookingStatus.UNAVAILABLE },
      { new: true, session }
    );

    if (!updateCarStatusResult) {
      throw new AppError(httpStatus.BAD_REQUEST, "Failed to update car status");
    }

    const bookingId = booking[0]._id;

    // Populate the user and car fields
    const result = await BookingModel.findById(bookingId)
      .populate("user")
      .populate("car")
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
