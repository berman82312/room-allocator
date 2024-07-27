export interface Guest {
  adult: number;
  child: number;
}

export interface Room {
  roomPrice: number;
  adultPrice: number;
  childPrice: number;
  capacity: number;
}

export interface RoomAllocation {
  adult: number;
  child: number;
  price: number;
}

export type GuestAllocation = RoomAllocation[];
