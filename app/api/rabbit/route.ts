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
  const breed = rabbitBreeds[randomIndex];

  return NextResponse.json({ breed });
}
