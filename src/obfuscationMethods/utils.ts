import { Point } from "./point";

export const shuffle = (array: any[]) => {
  let currentIndex = array.length;
  let randomIndex = 0;

  // While there remain elements to shuffle
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export function getRandomHexColor(): string {
  const color = Math.floor(Math.random() * 16777215).toString(16);

  return "#" + "0".repeat(6 - color.length) + color;
}

export function getRandomNumber(min: number, max: number): number {
  if (min > max) {
    throw new Error(
      "Minimum value must be less than or equal to the maximum value",
    );
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const ceilTo1 = (value: number) => {
  return value > 1 ? 1 : value;
};

export const getRandomPointInsidePolygon = (a: Point, b: Point, c: Point) => {
  // Random barycentric coefficients
  const r1 = Math.random();
  const r2 = Math.random();

  // Barycentric coefficients
  const l1 = 1 - Math.sqrt(r1);
  const l2 = (1 - r2) * Math.sqrt(r1);
  const l3 = r2 * Math.sqrt(r1);

  // Coordinates of the point inside the triangle
  const x = l1 * a.x + l2 * b.x + l3 * c.x;
  const y = l1 * a.y + l2 * b.y + l3 * c.y;

  return { x, y };
};

export const generateRandomString = (length: number) => {
  const alphabeticCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const allCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    if (i === 0) {
      const randomIndex = Math.floor(
        Math.random() * alphabeticCharacters.length,
      );
      randomString += alphabeticCharacters.charAt(randomIndex);
    } else {
      const randomIndex = Math.floor(Math.random() * allCharacters.length);
      randomString += allCharacters.charAt(randomIndex);
    }
  }

  return randomString;
};
