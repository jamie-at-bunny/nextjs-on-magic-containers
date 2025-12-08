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
