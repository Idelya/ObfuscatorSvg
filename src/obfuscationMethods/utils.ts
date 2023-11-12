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
  const distinctFigures = 4;
  const figureDiscriminator = Math.floor(Math.random() * distinctFigures);

  const width = getRandomNumber(minWidth, maxWidth);
  const height = getRandomNumber(minHeight, maxHeight);

  let element : SVGElement | null = null;

  switch(figureDiscriminator){
    case 0:
      // rect as rect
      element = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      element.setAttribute("x", x);
      element.setAttribute("y", y);
      element.setAttribute("width", width);
      element.setAttribute("height", height);
      break;
    case 1:
      // rect as path
      element = document.createElementNS("http://www.w3.org/2000/svg", "path");
      element.setAttribute("d", `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${y + height} Z`);
      break;
    case 2:
      // circle
      element = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      element.setAttribute("r", width/2);
      element.setAttribute("cx", x + width/2);
      element.setAttribute("cy", y + width/2);
      break;
    case 3:
      // polygon
      element = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
      element.setAttribute("points", `${x + width/2},${y} ${x},${y+height} ${x+width},${y+height}`);
      break;
  }

  element?.setAttribute("fill", getRandomHexColor());
  // TODO: Maybe some class with style opcity = 0?
  element?.setAttribute("opacity", 0);

  return element;
}

const getSectorPath = (outerDiameter: number, x: number, y: number, angleStart: number, angleEnd: number) => {
  const degreesToRadiansRatio = Math.PI / 180;
  const cr = outerDiameter / 2;
  const cx1 = Math.cos(degreesToRadiansRatio * angleEnd) * cr + x;
  const cy1 = -Math.sin(degreesToRadiansRatio * angleEnd) * cr + y;
  const cx2 = Math.cos(degreesToRadiansRatio * angleStart) * cr + x;
  const cy2 = -Math.sin(degreesToRadiansRatio * angleStart) * cr + y;

  return `M${x} ${y} ${cx1} ${cy1} A${cr} ${cr} 0 0 1 ${cx2} ${cy2}Z`;
};  

function getRandomHexColor(): string {
  const color = Math.floor(Math.random()*16777215).toString(16);
  
  return '#' + '0'.repeat(6 - color.length) + color;
}

function getRandomNumber(min: number, max: number): number {
  if (min > max) {
      throw new Error("Minimum value must be less than or equal to the maximum value");
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}