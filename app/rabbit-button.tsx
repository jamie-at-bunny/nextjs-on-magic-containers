"use client";

import { useState } from "react";
import { getRandomRabbitBreed } from "./actions";

export function RabbitButton() {
  const [breed, setBreed] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const result = await getRandomRabbitBreed();
    setBreed(result);
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
      >
        {loading ? "Loading..." : "Get Random Rabbit Breed"}
      </button>
      {breed && (
        <p className="text-lg font-medium text-gray-700">{breed}</p>
      )}
    </div>
  );
}
