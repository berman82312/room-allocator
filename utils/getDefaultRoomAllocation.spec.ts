import { describe, test, expect } from "vitest";
import { getDefaultRoomAllocation } from "./getDefaultRoomAllocation";

describe("getDeafultRoomAllocation", () => {
  test("case 1: normal case", () => {
    const guest = { adult: 4, child: 2 };
    const rooms = [
      { roomPrice: 1000, adultPrice: 200, childPrice: 100, capacity: 4 },
      { roomPrice: 0, adultPrice: 500, childPrice: 500, capacity: 4 },
      { roomPrice: 500, adultPrice: 300, childPrice: 200, capacity: 4 },
    ];

    const result = getDefaultRoomAllocation(guest, rooms);

    expect(result).toStrictEqual([
      { adult: 0, child: 0, price: 0 },
      { adult: 2, child: 0, price: 1000 },
      { adult: 2, child: 2, price: 1500 },
    ]);
  });

  test("case 2: all adults", () => {
    const guest = { adult: 16, child: 0 };
    const rooms = [
      { roomPrice: 500, adultPrice: 500, childPrice: 300, capacity: 4 },
      { roomPrice: 500, adultPrice: 500, childPrice: 300, capacity: 4 },
      { roomPrice: 0, adultPrice: 500, childPrice: 300, capacity: 8 },
      { roomPrice: 500, adultPrice: 1000, childPrice: 600, capacity: 2 },
    ];

    const result = getDefaultRoomAllocation(guest, rooms);

    expect(result).toStrictEqual([
      { adult: 4, child: 0, price: 2500 },
      { adult: 4, child: 0, price: 2500 },
      { adult: 8, child: 0, price: 4000 },
      { adult: 0, child: 0, price: 0 },
    ]);
  });

  test("case 3: only child", () => {
    const guest = { adult: 0, child: 1 };
    const rooms = [
      { roomPrice: 1000, adultPrice: 500, childPrice: 300, capacity: 2 },
      { roomPrice: 500, adultPrice: 400, childPrice: 300, capacity: 4 },
      { roomPrice: 0, adultPrice: 500, childPrice: 300, capacity: 8 },
    ];

    const result = getDefaultRoomAllocation(guest, rooms);

    expect(result).toStrictEqual([
      { adult: 0, child: 0, price: 0 },
      { adult: 0, child: 0, price: 0 },
      { adult: 0, child: 0, price: 0 },
    ]);
  });

  test("case 4: entire house is cheaper", () => {
    const guest = { adult: 10, child: 0 };
    const rooms = [
      { roomPrice: 10, adultPrice: 1000, childPrice: 300, capacity: 5 },
      { roomPrice: 10, adultPrice: 1000, childPrice: 300, capacity: 5 },
      { roomPrice: 10000, adultPrice: 0, childPrice: 0, capacity: 10 },
    ];

    const result = getDefaultRoomAllocation(guest, rooms);

    expect(result).toStrictEqual([
      { adult: 0, child: 0, price: 0 },
      { adult: 0, child: 0, price: 0 },
      { adult: 10, child: 0, price: 10000 },
    ]);
  });

  test("case 5: High room price but low head price", () => {
    const guest = { adult: 2, child: 4 };
    const rooms = [
      { roomPrice: 0, adultPrice: 1000, childPrice: 300, capacity: 5 },
      { roomPrice: 150, adultPrice: 500, childPrice: 20, capacity: 5 },
      { roomPrice: 1000, adultPrice: 100, childPrice: 10, capacity: 6 },
    ];

    const result = getDefaultRoomAllocation(guest, rooms);

    expect(result).toStrictEqual([
      { adult: 0, child: 0, price: 0 },
      { adult: 0, child: 0, price: 0 },
      { adult: 2, child: 4, price: 1240 },
    ]);
  });

  test("case 6: Same price", () => {
    const guest = { adult: 2, child: 4 };
    const rooms = [
      { roomPrice: 100, adultPrice: 1000, childPrice: 200, capacity: 5 },
      { roomPrice: 100, adultPrice: 1000, childPrice: 200, capacity: 5 },
      { roomPrice: 100, adultPrice: 1000, childPrice: 200, capacity: 5 },
    ];

    const result = getDefaultRoomAllocation(guest, rooms);

    expect(result).toStrictEqual([
      { adult: 1, child: 4, price: 1900 },
      { adult: 1, child: 0, price: 1100 },
      { adult: 0, child: 0, price: 0 },
    ]);
  });

  test("case 7: Best room price but over loading", () => {
    const guest = { adult: 3, child: 5 };
    const rooms = [
      { roomPrice: 0, adultPrice: 1000, childPrice: 300, capacity: 5 },
      { roomPrice: 150, adultPrice: 500, childPrice: 20, capacity: 5 },
      { roomPrice: 1000, adultPrice: 100, childPrice: 10, capacity: 6 },
    ];

    const result = getDefaultRoomAllocation(guest, rooms);

    expect(result).toStrictEqual([
      { adult: 0, child: 0, price: 0 },
      { adult: 1, child: 1, price: 670 },
      { adult: 2, child: 4, price: 1240 },
    ]);
  });
});
