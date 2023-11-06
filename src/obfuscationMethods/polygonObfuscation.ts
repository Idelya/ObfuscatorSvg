import { getRandomInt, shuffle } from "./utils";

const POLYGON_DIVISION_DEPTH = 3;
const STROKE_WIDTH = 1;

export const dividePolygon = (polygonSvg: SVGElement) => {
    const width = parseInt(polygonSvg.getAttribute("width")!);
    const height = parseInt(polygonSvg.getAttribute("height")!);
    const fill = polygonSvg.getAttribute("fill")!;

    const changeToPaths = true;
    const polygonElements = getDividedPolygonElements(width, height, fill, POLYGON_DIVISION_DEPTH, changeToPaths);
    return polygonElements;
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

const getDividedIntoPaths = (width: number, height: number, xInit: number, yInit: number, depth: number, paths: SVGElement[], fill: string) => {
    xInit = +xInit;
    yInit = +yInit;
    if (depth > 1){
        getDividedIntoPaths(width/2, height/2, +xInit +width/2, +yInit, depth - 1, paths, fill);
        getDividedIntoPaths(width/2, height/2, +xInit, +yInit + height, depth - 1, paths, fill);
        getDividedIntoPaths(width/2, height/2, +xInit + width, +yInit + height, depth - 1, paths, fill);
        getDividedIntoReversedPaths(width/2, height/2, +xInit + width/2, +yInit + height, depth - 1, paths, fill);
    }
    else {
        let opacity = getRandomInt(1, 100);
        let leftOpacity = (100-opacity);
        paths.push(createPath(fill, opacity/50 > 1 ? 1 : opacity/50, {x: xInit/2+width/2, y: yInit/2}, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2+3*width/4, y: yInit/2+height/2}));
        paths.push(createPath(fill, leftOpacity/50 > 1 ? 1 : leftOpacity/50, {x: xInit/2+width/2, y: yInit/2}, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2+3*width/4, y: yInit/2+height/2}));
        
        opacity = getRandomInt(1, 100);
        leftOpacity = (100-opacity);
        paths.push(createPath(fill, opacity/50 > 1 ? 1 : opacity/50, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2, y: yInit/2+height}, {x: xInit/2+width/2, y: yInit/2+height}));
        paths.push(createPath(fill, leftOpacity/50 > 1 ? 1 : leftOpacity/50, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2, y: yInit/2+height}, {x: xInit/2+width/2, y: yInit/2+height}));
        
        opacity = getRandomInt(1, 100);
        leftOpacity = (100-opacity);
        paths.push(createPath(fill, opacity/50 > 1 ? 1 : opacity/50, {x: xInit/2+3*width/4, y: yInit/2+height/2}, {x: xInit/2+width/2, y: yInit/2+height}, {x: xInit/2+width, y: yInit/2+height}));
        paths.push(createPath(fill, leftOpacity/50 > 1 ? 1 : leftOpacity/50, {x: xInit/2+3*width/4, y: yInit/2+height/2}, {x: xInit/2+width/2, y: yInit/2+height}, {x: xInit/2+width, y: yInit/2+height}));
        
        opacity = getRandomInt(1, 100);
        leftOpacity = (100-opacity);
        paths.push(createPath(fill, opacity/50 > 1 ? 1 : opacity/50, {x: xInit/2+width/2, y: yInit/2+height}, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2+3*width/4, y: yInit/2+height/2}));
        paths.push(createPath(fill, leftOpacity/50 > 1 ? 1 : leftOpacity/50, {x: xInit/2+width/2, y: yInit/2+height}, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2+3*width/4, y: yInit/2+height/2}));
    }
  }

  const getDividedIntoReversedPaths = (width: number, height: number, xInit: number, yInit: number, depth: number, paths: SVGElement[], fill: string) => {
    xInit = +xInit;
    yInit = +yInit;
    if (depth > 1){
        getDividedIntoPaths(width/2, height/2, +xInit +width/2, +yInit, depth - 1, paths, fill);
        getDividedIntoReversedPaths(width/2, height/2, +xInit, +yInit, depth - 1, paths, fill);
        getDividedIntoReversedPaths(width/2, height/2, +xInit + width, +yInit, depth - 1, paths, fill);
        getDividedIntoReversedPaths(width/2, height/2, +xInit + width/2, +yInit + height, depth - 1, paths, fill);
    }
    else {
        let opacity = getRandomInt(1, 100);
        let leftOpacity = (100-opacity);
        paths.push(createPath(fill, opacity/50 > 1 ? 1 : opacity/50, {x: xInit/2+width/2, y: yInit/2+height}, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2+3*width/4, y: yInit/2+height/2}));
        paths.push(createPath(fill, leftOpacity/50 > 1 ? 1 : leftOpacity/50, {x: xInit/2+width/2, y: yInit/2+height}, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2+3*width/4, y: yInit/2+height/2}));
        
        opacity = getRandomInt(1, 100);
        leftOpacity = (100-opacity);
        paths.push(createPath(fill, opacity/50 > 1 ? 1 : opacity/50, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2, y: yInit/2}, {x: xInit/2+width/2, y: yInit/2}));
        paths.push(createPath(fill, leftOpacity/50 > 1 ? 1 : leftOpacity/50, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2, y: yInit/2}, {x: xInit/2+width/2, y: yInit/2}));
        
        opacity = getRandomInt(1, 100);
        leftOpacity = (100-opacity);
        paths.push(createPath(fill, opacity/50 > 1 ? 1 : opacity/50, {x: xInit/2+3*width/4, y: yInit/2+height/2}, {x: xInit/2+width/2, y: yInit/2}, {x: xInit/2+width, y: yInit/2}));
        paths.push(createPath(fill, leftOpacity/50 > 1 ? 1 : leftOpacity/50, {x: xInit/2+3*width/4, y: yInit/2+height/2}, {x: xInit/2+width/2, y: yInit/2}, {x: xInit/2+width, y: yInit/2}));
        
        opacity = getRandomInt(1, 100);
        leftOpacity = (100-opacity);
        paths.push(createPath(fill, opacity/50 > 1 ? 1 : opacity/50, {x: xInit/2+width/2, y: yInit/2}, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2+3*width/4, y: yInit/2+height/2}));
        paths.push(createPath(fill, leftOpacity/50 > 1 ? 1 : leftOpacity/50, {x: xInit/2+width/2, y: yInit/2}, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2+3*width/4, y: yInit/2+height/2}));
    }
  }

const createPath = (fill: string, opacity: number, point1: Point, point2: Point, point3: Point) => {
    const fakeWidth = getRandomInt(1, point1.x);
    const fakeHeight = getRandomInt(1, point1.y);
    const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("widht", fakeWidth);
    pathElement.setAttribute("heigth", fakeHeight);
    pathElement.setAttribute("d", `M${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y} Z`);
    pathElement.setAttribute("fill", fill);
    pathElement.setAttribute("stroke", fill);
    pathElement.setAttribute("stroke-width", STROKE_WIDTH);
    pathElement.setAttribute("opacity", opacity);
    return pathElement;
}

const getDividedIntoPolygons = (width: number, height: number, xInit: number, yInit: number, depth: number, polygons: SVGElement[], fill: string) => {
    xInit = +xInit;
    yInit = +yInit;
    if (depth > 1){
        getDividedIntoPolygons(width/2, height/2, +xInit +width/2, +yInit, depth - 1, polygons, fill);
        getDividedIntoPolygons(width/2, height/2, +xInit, +yInit + height, depth - 1, polygons, fill);
        getDividedIntoPolygons(width/2, height/2, +xInit + width, +yInit + height, depth - 1, polygons, fill);
        getDividedIntoReversedPolygons(width/2, height/2, +xInit + width/2, +yInit + height, depth - 1, polygons, fill);
    }
    else {
        polygons.push(createPolygon(fill, 1, {x: xInit/2+width/2, y: yInit/2}, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2+3*width/4, y: yInit/2+height/2}));
        polygons.push(createPolygon(fill, 1, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2, y: yInit/2+height}, {x: xInit/2+width/2, y: yInit/2+height}));
        polygons.push(createPolygon(fill, 1, {x: xInit/2+3*width/4, y: yInit/2+height/2}, {x: xInit/2+width/2, y: yInit/2+height}, {x: xInit/2+width, y: yInit/2+height}));
        polygons.push(createPolygon(fill, 1, {x: xInit/2+width/2, y: yInit/2+height}, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2+3*width/4, y: yInit/2+height/2}));
    }
  }

  const getDividedIntoReversedPolygons = (width: number, height: number, xInit: number, yInit: number, depth: number, polygons: SVGElement[], fill: string) => {
    xInit = +xInit;
    yInit = +yInit;
    if (depth > 1){
        getDividedIntoPolygons(width/2, height/2, +xInit +width/2, +yInit, depth - 1, polygons, fill);
        getDividedIntoReversedPolygons(width/2, height/2, +xInit, +yInit, depth - 1, polygons, fill);
        getDividedIntoReversedPolygons(width/2, height/2, +xInit + width, +yInit, depth - 1, polygons, fill);
        getDividedIntoReversedPolygons(width/2, height/2, +xInit + width/2, +yInit + height, depth - 1, polygons, fill);
    }
    else {
        polygons.push(createPolygon(fill, 1, {x: xInit/2+width/2, y: yInit/2+height}, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2+3*width/4, y: yInit/2+height/2}));
        polygons.push(createPolygon(fill, 1, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2, y: yInit/2}, {x: xInit/2+width/2, y: yInit/2}));
        polygons.push(createPolygon(fill, 1, {x: xInit/2+3*width/4, y: yInit/2+height/2}, {x: xInit/2+width/2, y: yInit/2}, {x: xInit/2+width, y: yInit/2}));
        polygons.push(createPolygon(fill, 1, {x: xInit/2+width/2, y: yInit/2}, {x: xInit/2+width/4, y: yInit/2+height/2}, {x: xInit/2+3*width/4, y: yInit/2+height/2}));
    }
  }

const createPolygon = (fill: string, opacity: number, point1: Point, point2: Point, point3: Point) => {
    const fakeWidth = getRandomInt(1, point1.x);
    const fakeHeight = getRandomInt(1, point1.y);
    var polygonElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygonElement.setAttribute("widht", fakeWidth);
    polygonElement.setAttribute("heigth", fakeHeight);
    polygonElement.setAttribute("points", `${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y}`);
    polygonElement.setAttribute("fill", fill);
    polygonElement.setAttribute("stroke", fill);
    polygonElement.setAttribute("stroke-width", STROKE_WIDTH);
    polygonElement.setAttribute("opacity", opacity);
    return polygonElement;
}