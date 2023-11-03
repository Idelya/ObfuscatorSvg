import { shuffle } from "./utils";

const POLYGON_DIVISION_DEPTH = 5;

export const dividePolygon = (polygonSvg: SVGElement) => {
    const width = parseInt(polygonSvg.getAttribute("width")!);
    const height = parseInt(polygonSvg.getAttribute("height")!);
    const fill = polygonSvg.getAttribute("fill")!;

    const changeToPaths = true;
    const polygonElements = getDividedPolygonElements(width, height, fill, POLYGON_DIVISION_DEPTH, changeToPaths);
    const newSvgContent = polygonElements.join("");

    let devidedPolygonSvg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    devidedPolygonSvg.innerHTML = newSvgContent;

    polygonSvg.parentNode?.replaceChild(devidedPolygonSvg, polygonSvg);
}

const divideTriangle = (width: number, height: number, xInit: number, yInit: number, depth: number, isReversed: boolean, accum: string[], changeToPaths: boolean, fill: string) => {
    xInit = +xInit;
    yInit = +yInit;
    if (depth > 1){
      if (isReversed){
        divideTriangle(width/2, height/2, +xInit +width/2, +yInit, depth - 1, false, accum, changeToPaths, fill);
        divideTriangle(width/2, height/2, +xInit, +yInit, depth - 1, true, accum, changeToPaths, fill);
        divideTriangle(width/2, height/2, +xInit + width, +yInit, depth - 1, true, accum, changeToPaths, fill);
        divideTriangle(width/2, height/2, +xInit + width/2, +yInit + height, depth - 1, true, accum, changeToPaths, fill);
      }
      else {
        divideTriangle(width/2, height/2, +xInit +width/2, +yInit, depth - 1, false, accum, changeToPaths, fill);
        divideTriangle(width/2, height/2, +xInit, +yInit + height, depth - 1, false, accum, changeToPaths, fill);
        divideTriangle(width/2, height/2, +xInit + width, +yInit + height, depth - 1, false, accum, changeToPaths, fill);
        divideTriangle(width/2, height/2, +xInit + width/2, +yInit + height, depth - 1, true, accum, changeToPaths, fill);
      }
    }
    else {
      if (isReversed)
      {
        if (changeToPaths){
          accum.push(`<path d="M${xInit/2+width/2},${+yInit/2+height} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2} Z" fill="${fill}" />`);
          accum.push(`<path d="M${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2},${+yInit/2} ${xInit/2+width/2},${+yInit/2} Z" fill="${fill}" />`);
          accum.push(`<path d="M${xInit/2+3*width/4},${+yInit/2+height/2} ${xInit/2+width/2},${+yInit/2} ${xInit/2+width},${+yInit/2} Z" fill="${fill}" />`);
          accum.push(`<path d="M${xInit/2+width/2},${+yInit/2} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2} Z" fill="${fill}" />`);
        }
        else{
          accum.push(`<polygon points="${xInit/2+width/2},${+yInit/2+height} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2}" fill="${fill}" />`);
          accum.push(`<polygon points="${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2},${+yInit/2} ${xInit/2+width/2},${+yInit/2}" fill="${fill}" />`);
          accum.push(`<polygon points="${xInit/2+3*width/4},${+yInit/2+height/2} ${xInit/2+width/2},${+yInit/2} ${xInit/2+width},${+yInit/2}" fill="${fill}" />`);
          accum.push(`<polygon points="${xInit/2+width/2},${+yInit/2} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2}" fill="${fill}" />`);
        }
      }
      else {
        if (changeToPaths){
          accum.push(`<path d="M${xInit/2+width/2},${+yInit/2} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2} Z" fill="${fill}" />`);
          accum.push(`<path d="M${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2},${+yInit/2+height} ${xInit/2+width/2},${+yInit/2+height} Z" fill="${fill}" />`);
          accum.push(`<path d="M${xInit/2+3*width/4},${+yInit/2+height/2} ${xInit/2+width/2},${+yInit/2+height} ${xInit/2+width},${+yInit/2+height} Z" fill="${fill}" />`);
          accum.push(`<path d="M${xInit/2+width/2},${+yInit/2+height} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2} Z" fill="${fill}" />`);
        }
        else {
          accum.push(`<polygon points="${xInit/2+width/2},${+yInit/2} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2}" fill="${fill}" />`);
          accum.push(`<polygon points="${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2},${+yInit/2+height} ${xInit/2+width/2},${+yInit/2+height}" fill="${fill}" />`);
          accum.push(`<polygon points="${xInit/2+3*width/4},${+yInit/2+height/2} ${xInit/2+width/2},${+yInit/2+height} ${xInit/2+width},${+yInit/2+height}" fill="${fill}" />`);
          accum.push(`<polygon points="${xInit/2+width/2},${+yInit/2+height} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2}" fill="${fill}" />`);  
        }
      }
    }
  }
  
  const getDividedPolygonElements = (width, height, fill, divisionDepth, changeToPaths) => {
    const paths = [];
    divideTriangle(width,height,0,0,divisionDepth, false, paths, changeToPaths, fill);
    shuffle(paths);
    return paths;
  }