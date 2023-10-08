"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <button
        className="button"
        onClick={() => {
          router.push("/requests");
        }}
      >
        Requests Page
      </button>
    </div>
  );
}
