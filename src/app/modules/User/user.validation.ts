import { z } from "zod";
import { Role } from "./user.constant";

export const userValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required." }),
    email: z.string({ required_error: "Email is required." }).email(),
    role: z.enum([...Role] as [string, ...string[]]),
    password: z.string({ required_error: "password is required." }),
    phone: z.string({ required_error: "phone is required." }),
    address: z.string({ required_error: "address is required." }),
  }),
});

export const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    role: z.enum([...Role] as [string, ...string[]]).optional(),
    password: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const UserValidationSchema = {
  userValidationSchema,
  updateUserValidationSchema,
};
