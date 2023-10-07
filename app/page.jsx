"use client";

import { useRouter } from "next/navigation";
import { UserAuth } from "./firebase/context/AuthContext";

export default function Home() {
  const { user } = UserAuth();
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
