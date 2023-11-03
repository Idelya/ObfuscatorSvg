import { shuffle } from "./utils";

const RECT_DIVISION_DEPTH = 5;

export const divideRect = (rectSvg: SVGElement) => {
    const width = parseInt(rectSvg.getAttribute("width")!);
    const height = parseInt(rectSvg.getAttribute("height")!);
    const fill = rectSvg.getAttribute("fill")!;

    const changeToPaths = true;
    const rectangleElements = getDividedRectangleElements(width, height, fill, RECT_DIVISION_DEPTH, changeToPaths);
    return rectangleElements.join("");
}

const getDividedRectangleElements = (width: number, height: number, fill: string, divisionDepth: number, changeToPaths: boolean) => {
    const innerElements: string[] = [];
    if (changeToPaths){
        getDividedPaths(width, height, 0, 0, fill, divisionDepth, innerElements);
    } else {
        getDividedRects(width, height, 0, 0, fill, divisionDepth, innerElements);
    }
    shuffle(innerElements);
    return innerElements;
}

const getDividedRects = (width: number, height: number, xInit: number, yInit: number, fill: string, depth: number, rects: string[]) => {
    if (depth > 1){
        getDividedRects(width/2, height/2, xInit, yInit, fill, depth - 1, rects);
        getDividedRects(width/2, height/2, xInit + width/2, yInit, fill, depth - 1, rects);
        getDividedRects(width/2, height/2, xInit, yInit + height/2, fill, depth - 1, rects);
        getDividedRects(width/2, height/2, xInit + width/2, yInit + height/2, fill, depth - 1, rects);
    } else {
        rects.push(createRect(fill, xInit, yInit, width/2, height/2));
        rects.push(createRect(fill, xInit + width/2, yInit, width/2, height/2));
        rects.push(createRect(fill, xInit, yInit + height/2, width/2, height/2));
        rects.push(createRect(fill, xInit + width/2, yInit + height/2, width/2, height/2));
    }
}

const createRect = (fill: string, x: number, y: number, width: number, height: number) => {
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}" stroke="${fill}" stroke-width="1"></rect>`;
}

const getDividedPaths = (width: number, height: number, xInit: number, yInit: number, fill: string, depth: number, paths: string[]) => {
    if (depth > 1){
        getDividedPaths(width/2,height/2,xInit,yInit, fill, depth - 1, paths);
        getDividedPaths(width/2,height/2,xInit + width/2,yInit, fill, depth - 1, paths);
        getDividedPaths(width/2,height/2,xInit,yInit + height/2, fill, depth - 1, paths);
        getDividedPaths(width/2,height/2,xInit + width/2,yInit + height/2, fill, depth - 1, paths);
    } else {
        paths.push(createPath(fill, {x: xInit, y: yInit}, {x: xInit + width/2, y: yInit}, {x: xInit + width/2, y: yInit + height/2}, {x: xInit, y: yInit + height/2}));
        paths.push(createPath(fill, {x: xInit + width/2, y: yInit}, {x: xInit + width, y: yInit}, {x: xInit + width, y: yInit + height/2}, {x: xInit + width/2, y: yInit + height/2}));
        paths.push(createPath(fill, {x: xInit, y: yInit + height/2}, {x: xInit + width/2, y: yInit + height/2}, {x: xInit + width/2, y: yInit + height}, {x: xInit, y: yInit + height}));
        paths.push(createPath(fill, {x: xInit + width/2, y: yInit + height/2}, {x: xInit + width, y: yInit + height/2}, {x: xInit + width, y: yInit + height}, {x: xInit + width/2, y: yInit + height}));
    }
}

const createPath = (fill: string, poin1: Point, point2: Point, point3: Point, point4: Point) => {
    return `<path d="M ${poin1.x} ${poin1.y} L ${point2.x} ${point2.y} L ${point3.x} ${point3.y} L ${point4.x} ${point4.y} Z" fill="${fill}" stroke="${fill}" stroke-width="1"></path>`;
}
