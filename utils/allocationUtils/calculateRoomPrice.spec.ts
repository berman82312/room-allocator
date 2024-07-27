import { describe, expect, test } from "vitest";
import { calculateRoomPrice } from "./calculateRoomPrice";

describe("calcaulateRoomPrice", () => {
  test("case 1", () => {
    const room = { roomPrice: 1200, adultPrice: 200, childPrice: 300 };
    const allocation = { adult: 3, child: 2 };

    expect(calculateRoomPrice(room, allocation)).toBe(2400);
  });

  test("case 2", () => {
    const room = { roomPrice: 1000, adultPrice: 0, childPrice: 0 };
    const allocation = { adult: 3, child: 2 };

    expect(calculateRoomPrice(room, allocation)).toBe(1000);
  });

  test("case 3", () => {
    const room = { roomPrice: 0, adultPrice: 0, childPrice: 500 };
    const allocation = { adult: 3, child: 2 };

    expect(calculateRoomPrice(room, allocation)).toBe(1000);
  });

  test("case 4", () => {
    const room = { roomPrice: 0, adultPrice: 60, childPrice: 0 };
    const allocation = { adult: 3, child: 2 };

    expect(calculateRoomPrice(room, allocation)).toBe(180);
  });
});
