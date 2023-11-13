import { getRandomHexColor, getRandomNumber } from "./utils";

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
    element?.setAttribute("opacity", 0);
  
    return element;
  }

export const addIrrelevantFiguresTo = (elements: SVGElement[], maxX: number, maxY: number, maxWidth: number, maxHeight: number) => {
    const irrelevantFigures: SVGElement[] = [];
    for (let i = 0; i < elements.length; i++){
        const figX = Math.random() * maxX;
        const figY = Math.random() * maxY;
        irrelevantFigures.push(getRandomFigure(figX, figY, 0, maxWidth, 0, maxHeight));
    }
    irrelevantFigures.forEach(f => elements.push(f));
}