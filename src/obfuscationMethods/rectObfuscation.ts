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
        rects.push(`<rect x="${xInit}" y="${yInit}" width="${width/2}" height="${height/2}" fill="${fill}" stroke="${fill}" stroke-width="1"></rect>`);
        rects.push(`<rect x="${xInit + width/2}" y="${yInit}" width="${width/2}" height="${height/2}" fill="${fill}" stroke="${fill}" stroke-width="1"></rect>`);
        rects.push(`<rect x="${xInit}" y="${yInit + height/2}" width="${width/2}" height="${height/2}" fill="${fill}" stroke="${fill}" stroke-width="1"></rect>`);
        rects.push(`<rect x="${xInit + width/2}" y="${yInit + height/2}" width="${width/2}" height="${height/2}" fill="${fill}" stroke="${fill}" stroke-width="1"></rect>`);
    }
}

const getDividedPaths = (width: number, height: number, xInit: number, yInit: number, fill: string, depth: number, paths: string[]) => {
    if (depth > 1){
        getDividedPaths(width/2,height/2,xInit,yInit, fill, depth - 1, paths);
        getDividedPaths(width/2,height/2,xInit + width/2,yInit, fill, depth - 1, paths);
        getDividedPaths(width/2,height/2,xInit,yInit + height/2, fill, depth - 1, paths);
        getDividedPaths(width/2,height/2,xInit + width/2,yInit + height/2, fill, depth - 1, paths);
    } else {
        paths.push(`<path d="M ${xInit} ${yInit} L ${xInit + width/2} ${yInit} L ${xInit + width/2} ${yInit + height/2} L ${xInit} ${yInit + height/2} Z" fill="${fill}" stroke="${fill}" stroke-width="1"></path>`);
        paths.push(`<path d="M ${xInit + width/2} ${yInit} L ${xInit + width} ${yInit} L ${xInit + width} ${yInit + height/2} L ${xInit + width/2} ${yInit + height/2} Z" fill="${fill}" stroke="${fill}" stroke-width="1"></path>`);
        paths.push(`<path d="M ${xInit} ${yInit + height/2} L ${xInit + width/2} ${yInit + height/2} L ${xInit + width/2} ${yInit + height} L ${xInit} ${yInit + height} Z" fill="${fill}" stroke="${fill}" stroke-width="1"></path>`);
        paths.push(`<path d="M ${xInit + width/2} ${yInit + height/2} L ${xInit + width} ${yInit + height/2} L ${xInit + width} ${yInit + height} L ${xInit + width/2} ${yInit + height} Z" fill="${fill}" stroke="${fill}" stroke-width="1"></path>`);
    }
}
