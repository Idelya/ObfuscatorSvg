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

export const getRandomFigure = (x: number, y: number, minWidth: number, maxWidth: number, minHeight: number, maxHeight: number) => {
  // TODO: Logic
  var rectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rectElement.setAttribute("x", x);
  rectElement.setAttribute("y", y);
  rectElement.setAttribute("width", maxWidth);
  rectElement.setAttribute("height", maxHeight);
  rectElement.setAttribute("fill", getRandomFill());
  // TODO: Maybe some class with style opcity = 0?
  rectElement.setAttribute("opacity", 0);
  return rectElement;
}

const getRandomFill = () => {
  return "red";
}