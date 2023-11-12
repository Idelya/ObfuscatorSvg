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
  const distinctFigures = 6;
  const figureDiscriminator = Math.floor(Math.random() * distinctFigures);

  switch(figureDiscriminator){
    case 0:
      // rect as rect
      break;
    case 1:
      // rect as path
      break;
    case 2:
      // circle as circle
      break;
    case 3:
      // circle as path
      break;
    case 4:
      // polygon as polygon
      break;
    case 5:
      // polygon as path
      break;
  }

  // TODO: Logic
  var rectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  rectElement.setAttribute("x", x);
  rectElement.setAttribute("y", y);
  rectElement.setAttribute("width", maxWidth);
  rectElement.setAttribute("height", maxHeight);
  rectElement.setAttribute("fill", getRandomHexColor());
  // TODO: Maybe some class with style opcity = 0?
  rectElement.setAttribute("opacity", 0);
  return rectElement;
}

function getRandomHexColor(): string {
  const color = Math.floor(Math.random()*16777215).toString(16);
  
  return '#' + '0'.repeat(6 - color.length) + color;
}