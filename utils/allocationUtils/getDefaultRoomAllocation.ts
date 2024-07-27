import fp from "lodash/fp";
import {
  type GuestAllocation,
  type Guest,
  type Room,
  type RoomAllocation,
} from "@/types/RoomAllocation";
import calculateRoomPrice from "./calculateRoomPrice";

const ImpossiblePrice = Number.MAX_VALUE;

type Allocations = RoomAllocation[];

type PossibleAllocations = Allocations[];

type DPTable = {
  [key: number]: {
    [key: number]: PossibleAllocations | null;
  };
};

interface SolutionTable {
  rooms: Room[];
  solution: DPTable;
}

const emptyAllocation = { adult: 0, child: 0, price: 0 };

/**
 * Utilize DP algorithm to find the best allocation
 */
export function getDefaultRoomAllocation(
  guest: Guest,
  rooms: Room[]
): GuestAllocation {
  const dpSolutionTable = {
    rooms: rooms,
    solution: createDpTable(guest.adult, guest.child),
  } as SolutionTable;

  const result = findAllocations(dpSolutionTable, guest.adult, guest.child);

  if (result.length === 0) {
    // Cannot allocate
    return rooms.map((_) => fp.cloneDeep(emptyAllocation));
  }

  return result[0];
}

/**
 * Create a table to utilize dynamic programming.
 */
function createDpTable(adult: number, child: number) {
  const table = {} as DPTable;
  for (let i = 1; i <= adult; i++) {
    table[i] = {};
    for (let j = 0; j <= child; j++) {
      table[i][j] = null;
    }
  }
  return table;
}

/**
 * Utilize DP algorithm to find the best allocation price.
 * The solution might be more than one, with the same price.
 */
function findAllocations(
  solutionTable: SolutionTable,
  adult: number,
  child: number
) {
  if (adult === 0) {
    // Should not happen, return no possible result;
    return [];
  }

  if (solutionTable.solution[adult][child]) {
    // Solved already, return solution
    return solutionTable.solution[adult][child];
  }

  // Default possible solution is all guest in the same room.
  let possibleNewSolutions: [PossibleAllocations, number][] = [
    allocateSameRoom(solutionTable.rooms, adult, child),
  ];

  if (adult > 1) {
    // Find possible solution from adult - 1
    const previousAllocations = findAllocations(
      solutionTable,
      adult - 1,
      child
    );
    possibleNewSolutions = possibleNewSolutions.concat(
      previousAllocations.map((previousAllocation) => {
        return allocateNewGuest(
          solutionTable.rooms,
          previousAllocation,
          "adult"
        );
      })
    );
  }

  if (child > 0) {
    // Find possible solution form child - 1
    const previousAllocations = findAllocations(
      solutionTable,
      adult,
      child - 1
    );
    possibleNewSolutions = possibleNewSolutions.concat(
      previousAllocations.map((previousAllocation) => {
        return allocateNewGuest(
          solutionTable.rooms,
          previousAllocation,
          "child"
        );
      })
    );
  }

  // Dummy status: no solution
  let price = ImpossiblePrice;
  let allocations = [] as PossibleAllocations;

  const newPrice = Math.min(
    ...possibleNewSolutions.map((possibleSolution) => possibleSolution[1])
  );

  if (newPrice < price) {
    // Get the cheapest solution(s).
    const acceptedSolutions = possibleNewSolutions.filter(
      (newSolution) => newSolution[1] === newPrice
    );

    // Merge all possible solutions and eliminate duplicated allocations.
    acceptedSolutions.forEach((newAllocations) => {
      allocations = mergePossibleAllocations(allocations, newAllocations[0]);
    });
  }

  solutionTable.solution[adult][child] = allocations;
  return solutionTable.solution[adult][child];
}

function addGuestPrice(
  room: Room,
  allocation: RoomAllocation,
  guestType: "child" | "adult"
) {
  if (!room || !allocation) return ImpossiblePrice;

  if (guestType === "child" && allocation.adult === 0) {
    return ImpossiblePrice;
  }

  const currentPeople = allocation.adult + allocation.child;
  const leftCapacity = room.capacity - currentPeople;

  if (leftCapacity > 0) {
    const price = guestType === "child" ? room.childPrice : room.adultPrice;
    if (currentPeople === 0) {
      return room.roomPrice + price;
    }
    return price;
  }

  return ImpossiblePrice;
}

function allocateNewGuest(
  rooms: Room[],
  previousAllocation: Allocations,
  guestType: "child" | "adult"
): [PossibleAllocations, number] {
  const roomAddGuestPrices = rooms.map((room, index) =>
    addGuestPrice(room, previousAllocation[index], guestType)
  );

  const minPrice = Math.min(...roomAddGuestPrices);

  if (minPrice === ImpossiblePrice) {
    return [[], ImpossiblePrice];
  }

  const prePrice = previousAllocation.reduce((acc, cur) => acc + cur.price, 0);
  const newPrice = prePrice + minPrice;

  let allocations: PossibleAllocations = [];
  roomAddGuestPrices.map((price, index) => {
    if (price === minPrice) {
      const newAllocation = fp.cloneDeep(previousAllocation);
      if (guestType === "adult") {
        newAllocation[index].adult += 1;
      } else {
        newAllocation[index].child += 1;
      }
      newAllocation[index].price += minPrice;
      allocations.push(newAllocation);
    }
  });

  return [allocations, newPrice];
}

function mergePossibleAllocations(
  allocations1: PossibleAllocations,
  allocations2: PossibleAllocations
) {
  let mergedAllocations = [...allocations1];
  allocations2.forEach((newAllocation) => {
    const hasSame = allocations1.find((allocation) =>
      fp.isEqual(allocation, newAllocation)
    );
    if (!hasSame) mergedAllocations.push(newAllocation);
  });
  return mergedAllocations;
}

function allocateSameRoom(
  rooms: Room[],
  adult: number,
  child: number
): [PossibleAllocations, number] {
  const roomPrices = rooms.map((room) =>
    getRoomPriceForGuest(room, adult, child)
  );

  const minPrice = Math.min(...roomPrices);

  if (minPrice === ImpossiblePrice) {
    return [[], ImpossiblePrice];
  }

  let possibleSolutions: PossibleAllocations = [];
  roomPrices.forEach((price, index) => {
    if (price === minPrice) {
      const allocation = rooms.map(() => fp.cloneDeep(emptyAllocation));
      allocation[index].adult = adult;
      allocation[index].child = child;
      allocation[index].price = price;
      possibleSolutions.push(allocation);
    }
  });

  return [possibleSolutions, minPrice];
}

function getRoomPriceForGuest(room: Room, adult: number, child: number) {
  if (room.capacity < adult + child) {
    return ImpossiblePrice;
  }

  return calculateRoomPrice(room, { adult, child });
}

export default getDefaultRoomAllocation;
