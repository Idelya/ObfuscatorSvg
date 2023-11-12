import { ceilTo1, getRandomInt, getRandomFigure, shuffle } from "./utils";

const RECT_DIVISION_DEPTH = 3;
const STROKE_WIDTH = 1;

export const divideRect = (rectSvg: SVGElement) => {
    const width = parseInt(rectSvg.getAttribute("width")!);
    const height = parseInt(rectSvg.getAttribute("height")!);
    const fill = rectSvg.getAttribute("fill")!;

    const changeToPaths = true;
    const rectangleElements = getDividedRectangleElements(width, height, fill, RECT_DIVISION_DEPTH, changeToPaths);

    // TODO: Add elements in the middle
    rectangleElements.unshift(getRandomFigure(0, 0, width, width, height, height));
    rectangleElements.push(getRandomFigure(0, 0, width, width, height, height));

    return rectangleElements;
}

const getDividedRectangleElements = (width: number, height: number, fill: string, divisionDepth: number, changeToPaths: boolean) => {
    const innerElements: SVGElement[] = [];
    if (changeToPaths){
        getDividedPaths(width, height, 0, 0, fill, divisionDepth, innerElements);
    } else {
        getDividedRects(width, height, 0, 0, fill, divisionDepth, innerElements);
    }
    shuffle(innerElements);
    return innerElements;
}

const getDividedRects = (width: number, height: number, xInit: number, yInit: number, fill: string, depth: number, rects: SVGElement[]) => {
    if (depth > 1){
        getDividedRects(width/2, height/2, xInit, yInit, fill, depth - 1, rects);
        getDividedRects(width/2, height/2, xInit + width/2, yInit, fill, depth - 1, rects);
        getDividedRects(width/2, height/2, xInit, yInit + height/2, fill, depth - 1, rects);
        getDividedRects(width/2, height/2, xInit + width/2, yInit + height/2, fill, depth - 1, rects);
    } else {
        createCompletedRect(fill, xInit, yInit, width/2, height/2).forEach(r => rects.push(r));
        createCompletedRect(fill, xInit + width/2, yInit, width/2, height/2).forEach(r => rects.push(r));
        createCompletedRect(fill, xInit, yInit + height/2, width/2, height/2).forEach(r => rects.push(r));
        createCompletedRect(fill, xInit + width/2, yInit + height/2, width/2, height/2).forEach(r => rects.push(r));
    }
}

const createCompletedRect = (fill: string, x: number, y: number, width: number, height: number) => {
    const opacity = getRandomInt(1, 100)/50;
    const leftOpacity = (2-opacity);
    return [
        createPartialRect(fill, x, y, width, height, ceilTo1(opacity)),
        createPartialRect(fill, x, y, width, height, ceilTo1(leftOpacity))
    ];
} 

const createPartialRect = (fill: string, x: number, y: number, width: number, height: number, opacity: number) => {
    const fakeWidth = getRandomInt(1, x);
    const fakeHeight = getRandomInt(1, y);
    var rectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rectElement.setAttribute("widht", fakeWidth);
    rectElement.setAttribute("heigth", fakeHeight);
    rectElement.setAttribute("x", x);
    rectElement.setAttribute("y", y);
    rectElement.setAttribute("fill", fill);
    rectElement.setAttribute("stroke", fill);
    rectElement.setAttribute("width", width);
    rectElement.setAttribute("height", height);
    rectElement.setAttribute("stroke-width", STROKE_WIDTH);
    rectElement.setAttribute("opacity", opacity);
    return rectElement;
}

const getDividedPaths = (width: number, height: number, xInit: number, yInit: number, fill: string, depth: number, paths: SVGElement[]) => {
    if (depth > 1){
        getDividedPaths(width/2,height/2,xInit,yInit, fill, depth - 1, paths);
        getDividedPaths(width/2,height/2,xInit + width/2,yInit, fill, depth - 1, paths);
        getDividedPaths(width/2,height/2,xInit,yInit + height/2, fill, depth - 1, paths);
        getDividedPaths(width/2,height/2,xInit + width/2,yInit + height/2, fill, depth - 1, paths);
    } else {
        createCompletedPath(fill, {x: xInit, y: yInit}, {x: xInit + width/2, y: yInit}, {x: xInit + width/2, y: yInit + height/2}, {x: xInit, y: yInit + height/2}).forEach(p => paths.push(p));
        createCompletedPath(fill, {x: xInit + width/2, y: yInit}, {x: xInit + width, y: yInit}, {x: xInit + width, y: yInit + height/2}, {x: xInit + width/2, y: yInit + height/2}).forEach(p => paths.push(p));
        createCompletedPath(fill, {x: xInit, y: yInit + height/2}, {x: xInit + width/2, y: yInit + height/2}, {x: xInit + width/2, y: yInit + height}, {x: xInit, y: yInit + height}).forEach(p => paths.push(p));
        createCompletedPath(fill, {x: xInit + width/2, y: yInit + height/2}, {x: xInit + width, y: yInit + height/2}, {x: xInit + width, y: yInit + height}, {x: xInit + width/2, y: yInit + height}).forEach(p => paths.push(p));
    }
}

const createCompletedPath = (fill: string, point1: Point, point2: Point, point3: Point, point4: Point) => {
    const opacity = getRandomInt(1, 100)/50;
    const leftOpacity = (2-opacity);
    return [
        createPartialPath(fill, ceilTo1(opacity), point1, point2, point3, point4),
        createPartialPath(fill, ceilTo1(leftOpacity), point1, point2, point3, point4)
    ];
} 

const createPartialPath = (fill: string, opacity: number, point1: Point, point2: Point, point3: Point, point4: Point) => {
    const fakeWidth = getRandomInt(1, point1.x);
    const fakeHeight = getRandomInt(1, point1.y);
    var pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pathElement.setAttribute("d", `M ${point1.x} ${point1.y} L ${point2.x} ${point2.y} L ${point3.x} ${point3.y} L ${point4.x} ${point4.y} Z`);
    pathElement.setAttribute("width", fakeWidth);
    pathElement.setAttribute("height", fakeHeight);
    pathElement.setAttribute("fill", fill);
    pathElement.setAttribute("stroke", fill);
    pathElement.setAttribute("stroke-width", STROKE_WIDTH);
    pathElement.setAttribute("opacity", opacity);
    return pathElement;
}
