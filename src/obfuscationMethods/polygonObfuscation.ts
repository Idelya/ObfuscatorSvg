import { shuffle } from "./utils";

const POLYGON_DIVISION_DEPTH = 5;

export const dividePolygon = (polygonSvg: SVGElement) => {
    const width = parseInt(polygonSvg.getAttribute("width")!);
    const height = parseInt(polygonSvg.getAttribute("height")!);
    const fill = polygonSvg.getAttribute("fill")!;

    const changeToPaths = true;
    const polygonElements = getDividedPolygonElements(width, height, fill, POLYGON_DIVISION_DEPTH, changeToPaths);
    return polygonElements.join("");
}

const getDividedPolygonElements = (width: null, height: number, fill: string, divisionDepth: number, changeToPaths: boolean) => {
    const innerElements = [];
    if (changeToPaths){
        getDividedIntoPaths(width,height,0,0,divisionDepth, innerElements, fill);
    } else {
        getDividedIntoPolygons(width,height,0,0,divisionDepth, innerElements, fill);
    }
    shuffle(innerElements);
    return innerElements;
  }

const getDividedIntoPaths = (width: number, height: number, xInit: number, yInit: number, depth: number, paths: string[], fill: string) => {
    xInit = +xInit;
    yInit = +yInit;
    if (depth > 1){
        getDividedIntoPaths(width/2, height/2, +xInit +width/2, +yInit, depth - 1, paths, fill);
        getDividedIntoPaths(width/2, height/2, +xInit, +yInit + height, depth - 1, paths, fill);
        getDividedIntoPaths(width/2, height/2, +xInit + width, +yInit + height, depth - 1, paths, fill);
        getDividedIntoReversedPaths(width/2, height/2, +xInit + width/2, +yInit + height, depth - 1, paths, fill);
    }
    else {
        paths.push(`<path d="M${xInit/2+width/2},${+yInit/2} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2} Z" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
        paths.push(`<path d="M${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2},${+yInit/2+height} ${xInit/2+width/2},${+yInit/2+height} Z" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
        paths.push(`<path d="M${xInit/2+3*width/4},${+yInit/2+height/2} ${xInit/2+width/2},${+yInit/2+height} ${xInit/2+width},${+yInit/2+height} Z" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
        paths.push(`<path d="M${xInit/2+width/2},${+yInit/2+height} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2} Z" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
    }
  }

  const getDividedIntoReversedPaths = (width: number, height: number, xInit: number, yInit: number, depth: number, paths: string[], fill: string) => {
    xInit = +xInit;
    yInit = +yInit;
    if (depth > 1){
        getDividedIntoPaths(width/2, height/2, +xInit +width/2, +yInit, depth - 1, paths, fill);
        getDividedIntoReversedPaths(width/2, height/2, +xInit, +yInit, depth - 1, paths, fill);
        getDividedIntoReversedPaths(width/2, height/2, +xInit + width, +yInit, depth - 1, paths, fill);
        getDividedIntoReversedPaths(width/2, height/2, +xInit + width/2, +yInit + height, depth - 1, paths, fill);
    }
    else {
        paths.push(`<path d="M${xInit/2+width/2},${+yInit/2+height} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2} Z" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
        paths.push(`<path d="M${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2},${+yInit/2} ${xInit/2+width/2},${+yInit/2} Z" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
        paths.push(`<path d="M${xInit/2+3*width/4},${+yInit/2+height/2} ${xInit/2+width/2},${+yInit/2} ${xInit/2+width},${+yInit/2} Z" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
        paths.push(`<path d="M${xInit/2+width/2},${+yInit/2} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2} Z" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
    }
  }

const getDividedIntoPolygons = (width: number, height: number, xInit: number, yInit: number, depth: number, polygons: string[], fill: string) => {
    xInit = +xInit;
    yInit = +yInit;
    if (depth > 1){
        getDividedIntoPolygons(width/2, height/2, +xInit +width/2, +yInit, depth - 1, polygons, fill);
        getDividedIntoPolygons(width/2, height/2, +xInit, +yInit + height, depth - 1, polygons, fill);
        getDividedIntoPolygons(width/2, height/2, +xInit + width, +yInit + height, depth - 1, polygons, fill);
        getDividedIntoReversedPolygons(width/2, height/2, +xInit + width/2, +yInit + height, depth - 1, polygons, fill);
    }
    else {
        polygons.push(`<polygon points="${xInit/2+width/2},${+yInit/2} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2}" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
        polygons.push(`<polygon points="${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2},${+yInit/2+height} ${xInit/2+width/2},${+yInit/2+height}" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
        polygons.push(`<polygon points="${xInit/2+3*width/4},${+yInit/2+height/2} ${xInit/2+width/2},${+yInit/2+height} ${xInit/2+width},${+yInit/2+height}" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
        polygons.push(`<polygon points="${xInit/2+width/2},${+yInit/2+height} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2}" fill="${fill}" stroke="${fill}" stroke-width="1" />`);  
    }
  }

  const getDividedIntoReversedPolygons = (width: number, height: number, xInit: number, yInit: number, depth: number, polygons: string[], fill: string) => {
    xInit = +xInit;
    yInit = +yInit;
    if (depth > 1){
        getDividedIntoPolygons(width/2, height/2, +xInit +width/2, +yInit, depth - 1, polygons, fill);
        getDividedIntoReversedPolygons(width/2, height/2, +xInit, +yInit, depth - 1, polygons, fill);
        getDividedIntoReversedPolygons(width/2, height/2, +xInit + width, +yInit, depth - 1, polygons, fill);
        getDividedIntoReversedPolygons(width/2, height/2, +xInit + width/2, +yInit + height, depth - 1, polygons, fill);
    }
    else {
        polygons.push(`<polygon points="${xInit/2+width/2},${+yInit/2+height} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2}" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
        polygons.push(`<polygon points="${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2},${+yInit/2} ${xInit/2+width/2},${+yInit/2}" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
        polygons.push(`<polygon points="${xInit/2+3*width/4},${+yInit/2+height/2} ${xInit/2+width/2},${+yInit/2} ${xInit/2+width},${+yInit/2}" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
        polygons.push(`<polygon points="${xInit/2+width/2},${+yInit/2} ${xInit/2+width/4},${+yInit/2+height/2} ${xInit/2+3*width/4},${+yInit/2+height/2}" fill="${fill}" stroke="${fill}" stroke-width="1" />`);
    }
  }
