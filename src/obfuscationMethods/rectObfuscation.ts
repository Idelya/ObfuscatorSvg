import { shuffle } from "./utils";

const RECT_DIVISION_DEPTH = 5;

export const divideRect = (rectSvg: SVGElement, parentSvg: SVGAElement) => {
    const width = parseInt(rectSvg.getAttribute("width")!);
    const height = parseInt(rectSvg.getAttribute("height")!);
    const fill = rectSvg.getAttribute("fill")!;

    const rectanglePaths = getRectanglePaths(width, height, RECT_DIVISION_DEPTH, true, fill);

    const newSvgContent = rectanglePaths.join("");
    parentSvg.innerHTML = newSvgContent;
}

const getRectanglePaths = (width: number, height: number, divisionDepth: number, changeToPaths: boolean, fill: string) => {
    const paths: string[] = [];
    divideRectangle(width, height, 0, 0, divisionDepth, paths, changeToPaths, fill);
    shuffle(paths);
    return paths;
}

const divideRectangle = (width: number, height: number, xInit: number, yInit: number, depth: number, accum: string[], changeToPaths: boolean, fill: string) => {
    if (depth > 1){
        divideRectangle(width/2,height/2,xInit,yInit, depth - 1, accum, changeToPaths, fill);
        divideRectangle(width/2,height/2,xInit + width/2,yInit, depth - 1, accum, changeToPaths, fill);
        divideRectangle(width/2,height/2,xInit,yInit + height/2, depth - 1, accum, changeToPaths, fill);
        divideRectangle(width/2,height/2,xInit + width/2,yInit + height/2, depth - 1, accum, changeToPaths, fill);
    } else {
        if (changeToPaths) {
        accum.push(`<path d="M ${xInit} ${yInit} L ${xInit + width/2} ${yInit} L ${xInit + width/2} ${yInit + height/2} L ${xInit} ${yInit + height/2} Z" fill="${fill}"></path>`);
        accum.push(`<path d="M ${xInit + width/2} ${yInit} L ${xInit + width} ${yInit} L ${xInit + width} ${yInit + height/2} L ${xInit + width/2} ${yInit + height/2} Z" fill="${fill}"></path>`);
        accum.push(`<path d="M ${xInit} ${yInit + height/2} L ${xInit + width/2} ${yInit + height/2} L ${xInit + width/2} ${yInit + height} L ${xInit} ${yInit + height} Z" fill="${fill}"></path>`);
        accum.push(`<path d="M ${xInit + width/2} ${yInit + height/2} L ${xInit + width} ${yInit + height/2} L ${xInit + width} ${yInit + height} L ${xInit + width/2} ${yInit + height} Z" fill="${fill}"></path>`);
        } else {
        accum.push(`<rect x="${xInit}" y="${yInit}" width="${width/2}" height="${height/2}" fill="${fill}"></rect>`);
        accum.push(`<rect x="${xInit + width/2}" y="${yInit}" width="${width/2}" height="${height/2}" fill="${fill}"></rect>`);
        accum.push(`<rect x="${xInit}" y="${yInit + height/2}" width="${width/2}" height="${height/2}" fill="${fill}"></rect>`);
        accum.push(`<rect x="${xInit + width/2}" y="${yInit + height/2}" width="${width/2}" height="${height/2}" fill="${fill}"></rect>`);
        }
    }
}
