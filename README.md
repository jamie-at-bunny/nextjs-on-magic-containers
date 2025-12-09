# Next.js on Bunny Magic Containers

This guide walks through building and deploying a Next.js application on Bunny Magic Containers, demonstrating server components, server actions, API routes, and accessing Bunny CDN headers.

## Prerequisites

- Node.js 18+
- A Bunny.net account with Magic Containers access
- Docker (for container builds)

## Step 1: Create a New Next.js App

```bash
npx create-next-app@latest nextjs-on-magic-containers
```

Select the following options:

- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes

```bash
cd nextjs-on-magic-containers
```

## Step 2: Configure for Standalone Output

Edit `next.config.ts` to enable standalone output mode, which is optimized for container deployments:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
};

export default nextConfig;
```

## Step 3: Create a Basic Home Page

Replace the contents of `app/page.tsx`:

```tsx
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-12 font-sans p-6">
      <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black text-center">
        Next.js on Magic Containers!
      </h1>
    </div>
  );
}
```

Run the dev server to verify:

```bash
npm run dev
```

Visit http://localhost:3000 to see the page.

## Step 4: Add a Server Action

Server Actions allow you to run server-side code directly from your components without creating API endpoints.

Create `app/actions.ts`:

```ts
"use server";

const rabbitBreeds = [
  "Holland Lop",
  "Mini Rex",
  "Netherland Dwarf",
  "Lionhead",
  "Flemish Giant",
  "English Angora",
  "Dutch Rabbit",
  "Mini Lop",
  "Rex",
  "French Lop",
];

export async function getRandomRabbitBreed(): Promise<string> {
  const randomIndex = Math.floor(Math.random() * rabbitBreeds.length);
  return rabbitBreeds[randomIndex];
}
```

## Step 5: Create a Client Component to Call the Server Action

Create `app/rabbit-button.tsx`:

```tsx
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
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={handleClick}
        disabled={loading}
        className="px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
      >
        {loading ? "Loading..." : "Get Breed (Server Action)"}
      </button>
      {breed && <p className="text-lg font-medium text-gray-700">{breed}</p>}
    </div>
  );
}
```

Update `app/page.tsx` to include the button:

```tsx
import { RabbitButton } from "./rabbit-button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-12 font-sans p-6">
      <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black text-center">
        Next.js on Magic Containers!
      </h1>
      <RabbitButton />
    </div>
  );
}
```

Click the button to see the server action return a random rabbit breed.

## Step 6: Add an API Route

API Routes provide a traditional REST endpoint approach. Create `app/api/rabbit/route.ts`:

```ts
import { NextResponse } from "next/server";

const rabbitBreeds = [
  "Holland Lop",
  "Mini Rex",
  "Netherland Dwarf",
  "Lionhead",
  "Flemish Giant",
  "English Angora",
  "Dutch Rabbit",
  "Mini Lop",
  "Rex",
  "French Lop",
];

export async function GET() {
  const randomIndex = Math.floor(Math.random() * rabbitBreeds.length);
  return NextResponse.json({ breed: rabbitBreeds[randomIndex] });
}
```

Add a second button to `app/rabbit-button.tsx` that calls this API:

```tsx
"use client";

import { useState } from "react";
import { getRandomRabbitBreed } from "./actions";

export function RabbitButton() {
  const [serverActionBreed, setServerActionBreed] = useState<string | null>(
    null,
  );
  const [apiBreed, setApiBreed] = useState<string | null>(null);
  const [serverActionLoading, setServerActionLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);

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
    </div>
  );
}
```

Both buttons now work - one uses Server Actions, the other uses a traditional API route.

## Step 7: Display Bunny CDN Headers

When running on Magic Containers, Bunny injects request headers with information about the request. Create a server component to display these.

Create `app/bunny-headers.tsx`:

```tsx
import { headers } from "next/headers";

const BUNNY_HEADERS = ["cdn-requestcountrycode", "cdn-requestid"];

export async function BunnyHeaders() {
  const headersList = await headers();

  const bunnyHeaders = BUNNY_HEADERS.map((name) => ({
    name,
    value: headersList.get(name),
  })).filter((h) => h.value !== null);

  if (bunnyHeaders.length === 0) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-3">Bunny Request Headers</h2>
        <p className="text-gray-500 text-sm">
          No Bunny headers detected. This app may not be running behind Bunny
          CDN.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg p-6 max-w-md w-full">
      <h2 className="text-lg font-semibold mb-3">Bunny Request Headers</h2>
      <dl className="space-y-2">
        {bunnyHeaders.map(({ name, value }) => (
          <div key={name} className="flex flex-col">
            <dt className="text-xs font-mono text-gray-500">{name}</dt>
            <dd className="text-sm font-medium text-gray-800">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
```

Add it to `app/page.tsx`:

```tsx
import { RabbitButton } from "./rabbit-button";
import { BunnyHeaders } from "./bunny-headers";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-12 font-sans p-6">
      <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black text-center">
        Next.js on Magic Containers!
      </h1>
      <RabbitButton />
      <BunnyHeaders />
    </div>
  );
}
```

Locally, you'll see "No Bunny headers detected." Once deployed to Magic Containers, the panel will show the actual headers.

## Step 8: Add a Location Greeting Using Headers

Add a server action that reads the user's country from Bunny headers. Update `app/actions.ts`:

```ts
"use server";

import { headers } from "next/headers";

const rabbitBreeds = [
  "Holland Lop",
  "Mini Rex",
  "Netherland Dwarf",
  "Lionhead",
  "Flemish Giant",
  "English Angora",
  "Dutch Rabbit",
  "Mini Lop",
  "Rex",
  "French Lop",
];

export async function getRandomRabbitBreed(): Promise<string> {
  const randomIndex = Math.floor(Math.random() * rabbitBreeds.length);
  return rabbitBreeds[randomIndex];
}

export async function getLocationGreeting(): Promise<string> {
  const headersList = await headers();
  const countryCode = headersList.get("cdn-requestcountrycode");

  if (!countryCode) {
    return "Hello from somewhere in the world!";
  }

  return `Hello from ${countryCode}!`;
}
```

Add a button to call this in `app/rabbit-button.tsx`:

```tsx
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
```

Locally this will show "Hello from somewhere in the world!" but on Magic Containers it will show "Hello from GB!" (or your country code).

## Step 9: Build and Deploy to Magic Containers

Build the production version:

```bash
npm run build
```

Create a `Dockerfile` in the project root:

```dockerfile
FROM node:lts-alpine AS base

# Install
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN corepack enable pnpm && pnpm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN if [ -d "/app/public" ]; then cp -r /app/public ./public; fi

EXPOSE 3000
CMD ["node", "server.js"]

```

Build and push the Docker image to a container registry, then deploy to Bunny Magic Containers through the Bunny dashboard.

## Features Demonstrated

| Feature           | Description                                                                                  |
| ----------------- | -------------------------------------------------------------------------------------------- |
| Server Components | The `BunnyHeaders` component runs on the server and reads headers directly                   |
| Server Actions    | `getRandomRabbitBreed()` and `getLocationGreeting()` run server-side code without API routes |
| API Routes        | `/api/rabbit` provides a traditional REST endpoint                                           |
| Bunny Headers     | Access CDN request metadata like country code, request ID, and origin IP                     |
| Standalone Output | Optimized container build with minimal footprint                                             |

## Bunny CDN Headers Reference

| Header                   | Description                                         |
| ------------------------ | --------------------------------------------------- |
| `cdn-cache`              | Cache status (HIT or MISS)                          |
| `cdn-cachedat`           | Timestamp when the response was cached              |
| `cdn-edgestorageid`      | ID of the edge storage node                         |
| `cdn-proxyver`           | Version of the Bunny proxy                          |
| `cdn-pullzone`           | ID of the pull zone handling the request            |
| `cdn-requestcountrycode` | Two-letter country code of the request origin       |
| `cdn-requestid`          | Unique identifier for this request                  |
| `cdn-requestpullcode`    | HTTP status code from the origin pull               |
| `cdn-requestpullsuccess` | Whether the origin pull succeeded (True/False)      |
| `cdn-requesttime`        | Time taken to process the request (in milliseconds) |
| `cdn-status`             | HTTP status code returned by the CDN                |
| `server`                 | Bunny server identifier (e.g., BunnyCDN-UK1-886)    |
