import { z } from "zod";
import { RoomType } from "./room.constant";

export const roomValidationSchema = z.object({
  body: z.object({
    roomNo: z.number({ required_error: "Room No is required." }),
    description: z.string({ required_error: "Description is required." }),
    pricePerNight: z.number({ required_error: "Price per night is required." }),
    type: z.enum([...RoomType] as [string, ...string[]]),
    isBooked: z.boolean().optional(),
    isDeleted: z.boolean().optional(),
  }),
});

export const updateRoomValidationSchema = z.object({
  body: z.object({
    roomNo: z.number({ required_error: "Room No is required." }).optional(),
    description: z
      .string({ required_error: "Description is required." })
      .optional(),
    pricePerNight: z
      .number({ required_error: "Price per night is required." })
      .optional(),
    type: z.enum([...RoomType] as [string, ...string[]]).optional(),
    isBooked: z.boolean().optional().optional(),
    isDeleted: z.boolean().optional().optional(),
  }),
});
