import { TRoomType } from "./room.interface";

export const RoomType: TRoomType[] = ["single", "double"];

export const roomSearchTrams = ["type", "description"];

export const ROOM_TYPE = {
  single: "single",
  double: "double",
} as const;
