import { headers } from "next/headers";

const BUNNY_HEADERS = [
  "cdn-requestcountrycode",
  "cdn-requestpullcode",
  "cdn-requestpullsuccess",
  "cdn-uid",
  "cdn-originip",
  "cdn-originalhost",
  "cdn-pullzone",
  "cdn-requestid",
];

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
          No Bunny headers detected. This app may not be running behind Bunny CDN.
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
