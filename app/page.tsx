"use client";

import RoomAllocation from "@/components/RoomAllocation";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-[650px]">
        <RoomAllocation
          guest={{ adult: 2, child: 4 }}
          rooms={[
            { roomPrice: 0, adultPrice: 1000, childPrice: 300, capacity: 5 },
            { roomPrice: 150, adultPrice: 500, childPrice: 20, capacity: 5 },
            { roomPrice: 1000, adultPrice: 100, childPrice: 10, capacity: 6 },
          ]}
          onChange={(result) => console.log(result)}
        />
      </div>
    </main>
  );
}
