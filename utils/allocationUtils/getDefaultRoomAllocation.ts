import fp from "lodash/fp";
import {
  type GuestAllocation,
  type Guest,
  type Room,
  type RoomAllocation,
} from "@/types/RoomAllocation";

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

function findAllocations(
  solutionTable: SolutionTable,
  adult: number,
  child: number
) {
  if (adult === 0) {
    //Should not happen, return empty possible result;
    return [];
  }

  if (solutionTable.solution[adult][child]) {
    //Solved already, return solution
    return solutionTable.solution[adult][child];
  }

  let price = ImpossiblePrice;
  let allocations = [] as PossibleAllocations;

  if (adult > 1) {
    const previousAllocations = findAllocations(
      solutionTable,
      adult - 1,
      child
    );
    previousAllocations.forEach((previousAllocation) => {
      const [newAllocations, newPrice] = allocateAdult(
        solutionTable.rooms,
        previousAllocation
      );
      if (newPrice < price) {
        price = newPrice;
        allocations = newAllocations;
      } else if (newPrice === price) {
        allocations = mergePossibleAllocations(allocations, newAllocations);
      }
    });
  }

  if (child > 0) {
    const previousAllocations = findAllocations(
      solutionTable,
      adult,
      child - 1
    );
    previousAllocations.forEach((previousAllocation) => {
      const [newAllocations, newPrice] = allocateChild(
        solutionTable.rooms,
        previousAllocation
      );
      if (newPrice < price) {
        price = newPrice;
        allocations = newAllocations;
      } else if (newPrice === price) {
        allocations = mergePossibleAllocations(allocations, newAllocations);
      }
    });
  }

  const [newAllocations, newPrice] = allocateSameRoom(
    solutionTable.rooms,
    adult,
    child
  );

  if (newPrice < price) {
    allocations = newAllocations;
    price = newPrice;
  } else if (newPrice === price) {
    allocations = mergePossibleAllocations(allocations, newAllocations);
  }

  solutionTable.solution[adult][child] = allocations;

  return solutionTable.solution[adult][child];
}

function allocateAdult(
  rooms: Room[],
  previousAllocation: Allocations
): [PossibleAllocations, number] {
  const roomAddAdultPrices = fp
    .zip(rooms, previousAllocation)
    .map(([room, allocation]) => {
      if (!room || !allocation) return ImpossiblePrice;
      const currentPeople = allocation.adult + allocation.child;
      const leftCapacity = room.capacity - currentPeople;
      if (leftCapacity > 0) {
        if (currentPeople === 0) {
          return room.roomPrice + room.adultPrice;
        }

        return room.adultPrice;
      }

      return ImpossiblePrice;
    });

  const minPrice = Math.min(...roomAddAdultPrices);

  if (minPrice === ImpossiblePrice) {
    return [[], ImpossiblePrice];
  }

  const prePrice = previousAllocation.reduce((acc, cur) => acc + cur.price, 0);
  const newPrice = prePrice + minPrice;

  let allocations: PossibleAllocations = [];
  roomAddAdultPrices.map((price, index) => {
    if (price === minPrice) {
      const newAllocation = fp.cloneDeep(previousAllocation);
      newAllocation[index].adult += 1;
      newAllocation[index].price += minPrice;
      allocations.push(newAllocation);
    }
  });

  return [allocations, newPrice];
}

function allocateChild(
  rooms: Room[],
  previousAllocation: Allocations
): [PossibleAllocations, number] {
  const roomAddChildPrices = fp
    .zip(rooms, previousAllocation)
    .map(([room, allocation]) => {
      if (!room || !allocation) return ImpossiblePrice;
      if (allocation.adult === 0) return ImpossiblePrice;
      const currentPeople = allocation.adult + allocation.child;
      const leftCapacity = room.capacity - currentPeople;
      if (leftCapacity > 0) {
        return room.childPrice;
      }

      return ImpossiblePrice;
    });

  const minPrice = Math.min(...roomAddChildPrices);

  if (minPrice === ImpossiblePrice) {
    return [[], ImpossiblePrice];
  }

  const prePrice = previousAllocation.reduce((acc, cur) => acc + cur.price, 0);
  const newPrice = prePrice + minPrice;

  let allocations: PossibleAllocations = [];
  roomAddChildPrices.map((price, index) => {
    if (price === minPrice) {
      const newAllocation = fp.cloneDeep(previousAllocation);
      newAllocation[index].child += 1;
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
  const roomPrices = rooms.map((room) => allocatePrice(room, adult, child));

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

function allocatePrice(room: Room, adult: number, child: number) {
  if (room.capacity < adult + child) {
    return ImpossiblePrice;
  }

  return room.roomPrice + adult * room.adultPrice + child * room.childPrice;
}

export default getDefaultRoomAllocation;
