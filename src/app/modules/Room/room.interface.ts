export type TRoomType = "single" | "double";

export type TRoom = {
  roomNo: number;
  type: TRoomType;
  description: string;
  pricePerNight: number;
  isBooked: boolean;
  isDeleted: boolean;
};
