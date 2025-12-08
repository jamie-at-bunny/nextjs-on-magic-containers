"use client";

import { useState } from "react";
import { getRandomRabbitBreed, getLocationGreeting } from "./actions";

export function RabbitButton() {
  const [serverActionBreed, setServerActionBreed] = useState<string | null>(
    null,
  );
  const [apiBreed, setApiBreed] = useState<string | null>(null);
  const [greeting, setGreeting] = useState<string | null>(null);
  const [serverActionLoading, setServerActionLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [greetingLoading, setGreetingLoading] = useState(false);

  async function handleServerActionClick() {
    setServerActionLoading(true);
    const result = await getRandomRabbitBreed();
    setServerActionBreed(result);
    setServerActionLoading(false);
  }

  async function handleApiClick() {
    setApiLoading(true);
    const response = await fetch("/api/rabbit");
    const data = await response.json();
    setApiBreed(data.breed);
    setApiLoading(false);
  }

  async function handleGreetingClick() {
    setGreetingLoading(true);
    const result = await getLocationGreeting();
    setGreeting(result);
    setGreetingLoading(false);
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleServerActionClick}
          disabled={serverActionLoading}
          className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {serverActionLoading ? "Loading..." : "Get Breed (Server Action)"}
        </button>
        {serverActionBreed && (
          <p className="text-lg font-medium text-gray-700">
            {serverActionBreed}
          </p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleApiClick}
          disabled={apiLoading}
          className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {apiLoading ? "Loading..." : "Get Breed (API Route)"}
        </button>
        {apiBreed && (
          <p className="text-lg font-medium text-gray-700">{apiBreed}</p>
        )}
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={handleGreetingClick}
          disabled={greetingLoading}
          className="px-6 py-3 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {greetingLoading ? "Loading..." : "Get Location Greeting"}
        </button>
        {greeting && (
          <p className="text-lg font-medium text-gray-700">{greeting}</p>
        )}
      </div>
    </div>
  );
}
