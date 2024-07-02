import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/user.constant";
import {
  roomValidationSchema,
  updateRoomValidationSchema,
} from "./room.validation";
import { RoomController } from "./room.controller";

const router = Router();

router.get("/all-room", RoomController.getAllRoom);
router.get("/single-room/:id", RoomController.getSingleRoom);

router.post(
  "/create-room",
  auth(USER_ROLE.admin),
  validateRequest(roomValidationSchema),
  RoomController.createRoom // admin
);

router.put(
  "/update-room/:id",
  auth(USER_ROLE.admin),
  validateRequest(updateRoomValidationSchema),
  RoomController.updateRoom //admin
);

router.delete(
  "/delete-room/:id",
  auth(USER_ROLE.admin),
  RoomController.deleteRoom
); //admin

export const RoomRoutes = router;
