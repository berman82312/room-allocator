import {
  type Room,
  type Guest,
  type RoomAllocation as RoomPeopleAllocation,
  type GuestAllocation,
} from "@/types/RoomAllocation";
import { CustomInputNumber } from "./CustomInputNumber";
import { ChangeEventHandler, useEffect, useState } from "react";
import {
  calculateRoomPrice,
  getDefaultRoomAllocation,
} from "@/utils/allocationUtils";

interface RoomAllocationProps {
  guest: Guest;
  rooms: Room[];
  onChange: (result: GuestAllocation) => void;
}

export const RoomAllocation = (props: RoomAllocationProps) => {
  const { guest, rooms, onChange } = props;
  const [allocation, setAllocation] = useState(
    getDefaultRoomAllocation(guest, rooms)
  );

  useEffect(() => {
    onChange(allocation);
  }, [onChange, allocation]);

  const leftAdult =
    guest.adult - allocation.reduce((arr, cur) => arr + cur.adult, 0);
  const leftChild =
    guest.child - allocation.reduce((arr, cur) => arr + cur.child, 0);

  const handleAdultChange = (index: number, value: number) => {
    setAllocation((preAllocation) => {
      return preAllocation.map((roomAllocation, idx) => {
        if (idx !== index) {
          return roomAllocation;
        }

        roomAllocation.adult = value;
        roomAllocation.price = calculateRoomPrice(rooms[index], roomAllocation);

        return roomAllocation;
      });
    });
  };

  const handleChildChange = (index: number, value: number) => {
    setAllocation((preAllocation) => {
      return preAllocation.map((roomAllocation, idx) => {
        if (idx !== index) {
          return roomAllocation;
        }

        roomAllocation.child = value;
        roomAllocation.price = calculateRoomPrice(rooms[index], roomAllocation);

        return roomAllocation;
      });
    });
  };

  const renderRoom = (room: Room, index: number) => {
    return (
      <RoomState
        room={room}
        allocation={allocation[index]}
        leftAdult={leftAdult}
        leftChild={leftChild}
        key={`room_${index}`}
        name={`room_${index}`}
        onAdultChange={(event) =>
          handleAdultChange(index, Number(event.target.value))
        }
        onChildChange={(event) =>
          handleChildChange(index, Number(event.target.value))
        }
      />
    );
  };

  return (
    <div className="md:w-full">
      <div className="mb-4">
        <p className="font-bold text-xl">
          住客人數：{guest.adult} 位大人，{guest.child} 位小孩 / {rooms.length}{" "}
          房
        </p>
      </div>
      <LeftPeopleAlert adult={leftAdult} child={leftChild} />
      <div className="grid grid-cols-1 gap-0.5 bg-neutral-100">
        {rooms.map(renderRoom)}
      </div>
    </div>
  );
};

interface LeftPeopleAlertProps {
  adult: number;
  child: number;
}

const LeftPeopleAlert = (props: LeftPeopleAlertProps) => {
  const { adult, child } = props;
  if (adult + child === 0) {
    return null;
  }

  return (
    <div className="border rounded border-sky-300 bg-sky-50 my-4">
      <p className="p-4">
        尚未分配人數：{adult > 0 ? `${adult} 位大人` : null}
        {adult > 0 && child > 0 ? "，" : null}
        {child > 0 ? `${child} 位小孩` : null}
      </p>
    </div>
  );
};

interface RoomStateProps {
  room: Room;
  allocation: RoomPeopleAllocation;
  leftAdult: number;
  leftChild: number;
  name: string;
  onAdultChange: ChangeEventHandler<HTMLInputElement>;
  onChildChange: ChangeEventHandler<HTMLInputElement>;
}

const RoomState = (props: RoomStateProps) => {
  const {
    room,
    allocation,
    leftAdult,
    leftChild,
    onAdultChange,
    onChildChange,
  } = props;

  const leftCapacity = room.capacity - allocation.adult - allocation.child;
  const noAdult = allocation.adult === 0;
  const hasChild = allocation.child > 0;

  return (
    <div className="py-2 bg-white">
      <p className="font-bold text-lg">房間：{room.capacity} 人</p>
      <div className="flex justify-between my-4">
        <div>
          <p>大人</p>
          <p className="text-neutral-400">年齡 20+</p>
        </div>
        <div>
          <CustomInputNumber
            min={hasChild ? 1 : 0}
            max={allocation.adult + Math.min(leftCapacity, leftAdult)}
            name={`${props.name}_adult`}
            value={allocation.adult}
            disabled={false}
            step={1}
            onChange={onAdultChange}
            onBlur={() => {}}
          />
        </div>
      </div>
      <div className="flex justify-between my-4">
        <div>
          <p>小孩</p>
        </div>
        <div>
          <CustomInputNumber
            min={0}
            max={allocation.child + Math.min(leftCapacity, leftChild)}
            value={allocation.child}
            name={`${props.name}_child`}
            disabled={noAdult}
            step={1}
            onChange={onChildChange}
            onBlur={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default RoomAllocation;
