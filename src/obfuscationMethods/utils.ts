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

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
}