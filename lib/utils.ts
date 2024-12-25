import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRandomWord = async () => {
  try {
    const response = await fetch(
      "https://random-word-api.vercel.app/api?words=1&length=5",
    );
    const data = await response.json();
    return data[0].toUpperCase();
  } catch (error) {
    console.error("Error fetching word:", error);
    return "";
  }
};

export const validateWord = async (word: string) => {
  try {
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${word}&max=1`,
    );

    const data = await response.json();

    return data.length > 0 && data[0].word.toLowerCase() === word.toLowerCase();
  } catch (error) {
    console.error("Error checking word:", error);
  }
};
