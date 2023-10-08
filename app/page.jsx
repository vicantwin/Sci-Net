"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <h1 style={{ fontSize: "5rem" }}>Open Sci-Net</h1>
      <button
        className="button"
        onClick={() => {
          router.push("/requests");
        }}
      >
        Requests Page
      </button>
      <br />
      <br />
      <h2>A Project by:</h2>
      <h3>
        Presentation - Aasim Ahmed Khan, Mohammed Abaan Khan, Syed Nubaid
        Hussain
      </h3>
      <h3>Programming - Aaryanathan Somasundaram, Saayuj Sajith</h3>
      <br />
    </div>
  );
}
