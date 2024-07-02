import { Router } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import validateRequest from "../../middlewares/validateRequest";
import { bookingValidationSchema } from "./booking.validation";
import { BookingController } from "./booking.controller";

const router = Router();

router.get(
  "/all-booking",
  auth(USER_ROLE.admin),
  BookingController.getAllBooking
); //admin

router.get(
  "/single-booking/:id",
  auth(USER_ROLE.admin),
  BookingController.getAllBooking
); //admin

router.get(
  "/my-bookings",
  auth(USER_ROLE.user),
  BookingController.getSingleBooking
); //user all booking

router.post(
  "/create-bookings",
  auth(USER_ROLE.user),
  validateRequest(bookingValidationSchema),
  BookingController.createBooking //user only
);

router.patch(
  "/check-in",
  auth(USER_ROLE.user),
  validateRequest(bookingValidationSchema),
  BookingController.createBooking //user only
);

router.patch(
  "/check-out",
  auth(USER_ROLE.user),
  validateRequest(bookingValidationSchema),
  BookingController.createBooking //user only
);

router.patch(
  "/cancel-bookings",
  auth(USER_ROLE.user),
  validateRequest(bookingValidationSchema),
  BookingController.createBooking //user only
);

export const BookingRoutes = router;
