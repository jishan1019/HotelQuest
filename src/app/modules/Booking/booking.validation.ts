import { z } from "zod";

export const bookingValidationSchema = z.object({
  body: z.object({
    bookedAt: z.string({ required_error: "Booking time is required." }),
    room: z.string({ required_error: "Room Id is required." }),
  }),
});
