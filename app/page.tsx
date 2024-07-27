"use client";

import RoomAllocation from "@/components/RoomAllocation";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-[650px]">
        <RoomAllocation
          guest={{ adult: 4, child: 2 }}
          rooms={[
            { roomPrice: 1000, adultPrice: 200, childPrice: 100, capacity: 4 },
            { roomPrice: 0, adultPrice: 500, childPrice: 500, capacity: 4 },
            { roomPrice: 500, adultPrice: 300, childPrice: 200, capacity: 4 },
          ]}
          onChange={(result) => console.log(result)}
          onBlur={() => {}}
        />
      </div>
    </main>
  );
}
