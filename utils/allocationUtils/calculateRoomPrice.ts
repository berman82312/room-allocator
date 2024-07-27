import { type Room, type RoomAllocation } from "@/types/RoomAllocation";

type CalculateRoom = Omit<Room, "capacity">;
type CalculateAllocation = Omit<RoomAllocation, "price">;

export function calculateRoomPrice(
  room: CalculateRoom,
  allocation: CalculateAllocation
) {
  if (allocation.adult + allocation.child === 0) {
    return 0;
  }

  return (
    room.roomPrice +
    room.adultPrice * allocation.adult +
    room.childPrice * allocation.child
  );
}

export default calculateRoomPrice;
