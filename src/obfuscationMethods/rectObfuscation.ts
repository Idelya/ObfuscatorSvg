import { ObfuscationParams } from "./obfuscationParams";
import { Point } from "./point";
import { addIrrelevantFiguresTo, getRandomFigure } from "./sharedObfuscation";
import { ceilTo1, getRandomInt, shuffle } from "./utils";

const STROKE_WIDTH = 1;

export const divideRect = (rectSvg: SVGElement) => {
  // TODO: Add to parameter list
  const params: ObfuscationParams = {
    divisionStrength: 3,
    elementTag: "path",
    addIrrelevantFigures: true,
    addIrrelevantAttributes: true,
    randomizeElements: true,
    figureSplitBy: "opacity",
    fillType: "original",
  };

  const width = parseInt(rectSvg.getAttribute("width")!);
  const height = parseInt(rectSvg.getAttribute("height")!);
  const originalFill = rectSvg.getAttribute("fill")!;

  const rectangleElements = getDividedRectangleElements(width, height, originalFill, params);

  if (params.addIrrelevantFigures) {
    addIrrelevantFiguresTo(rectangleElements, width / 2, height / 2, width / 2, height / 2);
  }

  if (params.randomizeElements) {
    shuffle(rectangleElements);
  }

  if (params.addIrrelevantFigures) {
    rectangleElements.unshift(getRandomFigure(0, 0, width, width, height, height));
    rectangleElements.push(getRandomFigure(0, 0, width, width, height, height));
  }

  return rectangleElements;
};

const getDividedRectangleElements = (width: number, height: number, fill: string, params: ObfuscationParams) => {
  const innerElements: SVGElement[] = [];
  if (params.elementTag === "path") {
    getDividedPaths(width, height, 0, 0, fill, params.divisionStrength, innerElements, params);
  } else {
    getDividedRects(width, height, 0, 0, fill, params.divisionStrength, innerElements, params);
  }
  return innerElements;
};

const getDividedRects = (
  width: number,
  height: number,
  xInit: number,
  yInit: number,
  fill: string,
  depth: number,
  rects: SVGElement[],
  params: ObfuscationParams,
) => {
  if (depth > 1) {
    getDividedRects(width / 2, height / 2, xInit, yInit, fill, depth - 1, rects, params);
    getDividedRects(width / 2, height / 2, xInit + width / 2, yInit, fill, depth - 1, rects, params);
    getDividedRects(width / 2, height / 2, xInit, yInit + height / 2, fill, depth - 1, rects, params);
    getDividedRects(width / 2, height / 2, xInit + width / 2, yInit + height / 2, fill, depth - 1, rects, params);
  } else {
    createCompletedRect(fill, xInit, yInit, width / 2, height / 2, params).forEach((r: SVGElement) => rects.push(r));
    createCompletedRect(fill, xInit + width / 2, yInit, width / 2, height / 2, params).forEach((r) => rects.push(r));
    createCompletedRect(fill, xInit, yInit + height / 2, width / 2, height / 2, params).forEach((r) => rects.push(r));
    createCompletedRect(fill, xInit + width / 2, yInit + height / 2, width / 2, height / 2, params).forEach((r) => rects.push(r));
  }
};

const createCompletedRect = (fill: string, x: number, y: number, width: number, height: number, params: ObfuscationParams) => {
  if (params.figureSplitBy === "opacity") {
    const opacity = getRandomInt(1, 100) / 50;
    const leftOpacity = 2 - opacity;
    return [
      createPartialRect(fill, x, y, width, height, ceilTo1(opacity), params),
      createPartialRect(fill, x, y, width, height, ceilTo1(leftOpacity), params),
    ];
  }
  return [createPartialRect(fill, x, y, width, height, 1, params)];
};

const createPartialRect = (fill: string, x: number, y: number, width: number, height: number, opacity: number, params: ObfuscationParams) => {
  const rectElement = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  if (params.addIrrelevantAttributes) {
    const fakeWidth = getRandomInt(1, x);
    const fakeHeight = getRandomInt(1, y);
    rectElement.setAttribute("widht", fakeWidth.toString());
    rectElement.setAttribute("heigth", fakeHeight.toString());
  }
  rectElement.setAttribute("x", x.toString());
  rectElement.setAttribute("y", y.toString());
  rectElement.setAttribute("fill", fill);
  rectElement.setAttribute("stroke", fill);
  rectElement.setAttribute("width", width.toString());
  rectElement.setAttribute("height", height.toString());
  rectElement.setAttribute("stroke-width", STROKE_WIDTH.toString());
  rectElement.setAttribute("opacity", opacity.toString());
  return rectElement;
};

const getDividedPaths = (
  width: number,
  height: number,
  xInit: number,
  yInit: number,
  fill: string,
  depth: number,
  paths: SVGElement[],
  params: ObfuscationParams,
) => {
  if (depth > 1) {
    getDividedPaths(width / 2, height / 2, xInit, yInit, fill, depth - 1, paths, params);
    getDividedPaths(width / 2, height / 2, xInit + width / 2, yInit, fill, depth - 1, paths, params);
    getDividedPaths(width / 2, height / 2, xInit, yInit + height / 2, fill, depth - 1, paths, params);
    getDividedPaths(width / 2, height / 2, xInit + width / 2, yInit + height / 2, fill, depth - 1, paths, params);
  } else {
    createCompletedPath(
      fill,
      { x: xInit, y: yInit },
      { x: xInit + width / 2, y: yInit },
      { x: xInit + width / 2, y: yInit + height / 2 },
      { x: xInit, y: yInit + height / 2 },
      params,
    ).forEach((p) => paths.push(p));
    createCompletedPath(
      fill,
      { x: xInit + width / 2, y: yInit },
      { x: xInit + width, y: yInit },
      { x: xInit + width, y: yInit + height / 2 },
      { x: xInit + width / 2, y: yInit + height / 2 },
      params,
    ).forEach((p) => paths.push(p));
    createCompletedPath(
      fill,
      { x: xInit, y: yInit + height / 2 },
      { x: xInit + width / 2, y: yInit + height / 2 },
      { x: xInit + width / 2, y: yInit + height },
      { x: xInit, y: yInit + height },
      params,
    ).forEach((p) => paths.push(p));
    createCompletedPath(
      fill,
      { x: xInit + width / 2, y: yInit + height / 2 },
      { x: xInit + width, y: yInit + height / 2 },
      { x: xInit + width, y: yInit + height },
      { x: xInit + width / 2, y: yInit + height },
      params,
    ).forEach((p) => paths.push(p));
  }
};

const createCompletedPath = (fill: string, point1: Point, point2: Point, point3: Point, point4: Point, params: ObfuscationParams) => {
  if (params.figureSplitBy === "opacity") {
    const opacity = getRandomInt(1, 100) / 50;
    const leftOpacity = 2 - opacity;
    return [
      createPartialPath(fill, ceilTo1(opacity), point1, point2, point3, point4, params),
      createPartialPath(fill, ceilTo1(leftOpacity), point1, point2, point3, point4, params),
    ];
  }
  return [createPartialPath(fill, 1, point1, point2, point3, point4, params)];
};

const createPartialPath = (fill: string, opacity: number, point1: Point, point2: Point, point3: Point, point4: Point, params: ObfuscationParams) => {
  const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathElement.setAttribute("d", `M ${point1.x} ${point1.y} L ${point2.x} ${point2.y} L ${point3.x} ${point3.y} L ${point4.x} ${point4.y} Z`);
  if (params.addIrrelevantAttributes) {
    const fakeWidth = getRandomInt(1, point1.x);
    const fakeHeight = getRandomInt(1, point1.y);
    pathElement.setAttribute("width", fakeWidth.toString());
    pathElement.setAttribute("height", fakeHeight.toString());
  }
  pathElement.setAttribute("fill", fill);
  pathElement.setAttribute("stroke", fill);
  pathElement.setAttribute("stroke-width", STROKE_WIDTH.toString());
  pathElement.setAttribute("opacity", opacity.toString());
  return pathElement;
};
