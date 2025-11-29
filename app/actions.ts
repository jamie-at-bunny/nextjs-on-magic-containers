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
