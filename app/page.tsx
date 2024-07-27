'use client';

import { CustomInputNumber } from "@/components/CustomInputNumber";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <CustomInputNumber
        min={1}
        max={16}
        step={1}
        name={'test'}
        value={1}
        disabled={true}
        onChange={event => console.log("on change: ")}
        onBlur={event => console.log("on blur: ")}
      />
    </main>
  );
}
