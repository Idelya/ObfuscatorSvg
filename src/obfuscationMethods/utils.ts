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
}

export function getRandomHexColor(): string {
  const color = Math.floor(Math.random()*16777215).toString(16);
  
  return '#' + '0'.repeat(6 - color.length) + color;
}

export function getRandomNumber(min: number, max: number): number {
  if (min > max) {
      throw new Error("Minimum value must be less than or equal to the maximum value");
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
}

export const ceilTo1 = (value: number) => {
  return value > 1 ? 1 : value;
}