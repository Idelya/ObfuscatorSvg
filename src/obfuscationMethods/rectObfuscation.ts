import { ObfuscationParams } from "./obfuscationParams";
import { Point } from "./point";
import {
  addIrrelevantFiguresTo,
  getRandomFigure,
  setFigureColor,
} from "./sharedObfuscation";
import { ceilTo1, getRandomInt, shuffle } from "./utils";

const STROKE_WIDTH = 1;

export const divideRect = (rectSvg: SVGElement, params: ObfuscationParams) => {
  const width = parseInt(rectSvg.getAttribute("width")!);
  const height = parseInt(rectSvg.getAttribute("height")!);
  const originalFill = rectSvg.getAttribute("fill")!;

  const rectParams: RectObfuscationParams = {
    ...params,
    height,
    width,
    originalFill,
    x: 0,
    y: 0,
    elements: [],
  };

  getDividedRectangleElements(rectParams);

  if (params.addIrrelevantFigures) {
    addIrrelevantFiguresTo(
      rectParams.elements,
      width / 2,
      height / 2,
      width / 2,
      height / 2,
    );
  }

  if (params.randomizeElements) {
    shuffle(rectParams.elements);
  }

  if (params.addIrrelevantFigures) {
    rectParams.elements.unshift(
      getRandomFigure(0, 0, width, width, height, height),
    );
    rectParams.elements.push(
      getRandomFigure(0, 0, width, width, height, height),
    );
  }

  return rectParams.elements;
};

const getDividedRectangleElements = (params: RectObfuscationParams) => {
  const innerElements: SVGElement[] = [];
  if (params.elementTag === "path") {
    getDividedPaths(params);
  } else {
    getDividedRects(params);
  }
  return innerElements;
};

const getDividedRects = (params: RectObfuscationParams) => {
  if (params.divisionStrength > 1) {
    getDividedRects({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedRects({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width / 2,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedRects({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      y: params.y + params.height / 2,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedRects({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width / 2,
      y: params.y + params.height / 2,
      divisionStrength: params.divisionStrength - 1,
    });
  } else {
    createCompletedRect({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
    }).forEach((r: SVGElement) => params.elements.push(r));
    createCompletedRect({
      ...params,
      x: params.x + params.width / 2,
      width: params.width / 2,
      height: params.height / 2,
    }).forEach((r) => params.elements.push(r));
    createCompletedRect({
      ...params,
      y: params.y + params.height / 2,
      width: params.width / 2,
      height: params.height / 2,
    }).forEach((r) => params.elements.push(r));
    createCompletedRect({
      ...params,
      x: params.x + params.width / 2,
      y: params.y + params.height / 2,
      width: params.width / 2,
      height: params.height / 2,
    }).forEach((r) => params.elements.push(r));
  }
};

const createCompletedRect = (params: RectObfuscationParams) => {
  if (params.figureSplitBy === "opacity") {
    const opacity = getRandomInt(1, 100) / 50;
    const leftOpacity = 2 - opacity;
    return [
      createPartialRect(ceilTo1(opacity), params),
      createPartialRect(ceilTo1(leftOpacity), params),
    ];
  }
  return [createPartialRect(1, params)];
};

const createPartialRect = (opacity: number, params: RectObfuscationParams) => {
  const rectElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect",
  );
  if (params.addIrrelevantAttributes) {
    const fakeWidth = getRandomInt(1, params.x);
    const fakeHeight = getRandomInt(1, params.y);
    rectElement.setAttribute("widht", fakeWidth.toString());
    rectElement.setAttribute("heigth", fakeHeight.toString());
  }
  rectElement.setAttribute("x", params.x.toString());
  rectElement.setAttribute("y", params.y.toString());
  setFigureColor(rectElement, params, params.originalFill);
  rectElement.setAttribute("width", params.width.toString());
  rectElement.setAttribute("height", params.height.toString());
  rectElement.setAttribute("stroke-width", STROKE_WIDTH.toString());
  rectElement.setAttribute("opacity", opacity.toString());
  return rectElement;
};

const getDividedPaths = (params: RectObfuscationParams) => {
  if (params.divisionStrength > 1) {
    getDividedPaths({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x,
      y: params.y,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedPaths({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width / 2,
      y: params.y,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedPaths({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x,
      y: params.y + params.height / 2,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedPaths({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width / 2,
      y: params.y + params.height / 2,
      divisionStrength: params.divisionStrength - 1,
    });
  } else {
    createCompletedPath(
      params.originalFill,
      { x: params.x, y: params.y },
      { x: params.x + params.width / 2, y: params.y },
      { x: params.x + params.width / 2, y: params.y + params.height / 2 },
      { x: params.x, y: params.y + params.height / 2 },
      params,
    ).forEach((p) => params.elements.push(p));
    createCompletedPath(
      params.originalFill,
      { x: params.x + params.width / 2, y: params.y },
      { x: params.x + params.width, y: params.y },
      { x: params.x + params.width, y: params.y + params.height / 2 },
      { x: params.x + params.width / 2, y: params.y + params.height / 2 },
      params,
    ).forEach((p) => params.elements.push(p));
    createCompletedPath(
      params.originalFill,
      { x: params.x, y: params.y + params.height / 2 },
      { x: params.x + params.width / 2, y: params.y + params.height / 2 },
      { x: params.x + params.width / 2, y: params.y + params.height },
      { x: params.x, y: params.y + params.height },
      params,
    ).forEach((p) => params.elements.push(p));
    createCompletedPath(
      params.originalFill,
      { x: params.x + params.width / 2, y: params.y + params.height / 2 },
      { x: params.x + params.width, y: params.y + params.height / 2 },
      { x: params.x + params.width, y: params.y + params.height },
      { x: params.x + params.width / 2, y: params.y + params.height },
      params,
    ).forEach((p) => params.elements.push(p));
  }
};

const createCompletedPath = (
  fill: string,
  point1: Point,
  point2: Point,
  point3: Point,
  point4: Point,
  params: ObfuscationParams,
) => {
  if (params.figureSplitBy === "opacity") {
    const opacity = getRandomInt(1, 100) / 50;
    const leftOpacity = 2 - opacity;
    return [
      createPartialPath(
        fill,
        ceilTo1(opacity),
        point1,
        point2,
        point3,
        point4,
        params,
      ),
      createPartialPath(
        fill,
        ceilTo1(leftOpacity),
        point1,
        point2,
        point3,
        point4,
        params,
      ),
    ];
  }
  return [createPartialPath(fill, 1, point1, point2, point3, point4, params)];
};

const createPartialPath = (
  fill: string,
  opacity: number,
  point1: Point,
  point2: Point,
  point3: Point,
  point4: Point,
  params: ObfuscationParams,
) => {
  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  pathElement.setAttribute(
    "d",
    `M ${point1.x} ${point1.y} L ${point2.x} ${point2.y} L ${point3.x} ${point3.y} L ${point4.x} ${point4.y} Z`,
  );
  if (params.addIrrelevantAttributes) {
    const fakeWidth = getRandomInt(1, point1.x);
    const fakeHeight = getRandomInt(1, point1.y);
    pathElement.setAttribute("width", fakeWidth.toString());
    pathElement.setAttribute("height", fakeHeight.toString());
  }
  setFigureColor(pathElement, params, fill);
  pathElement.setAttribute("stroke-width", STROKE_WIDTH.toString());
  pathElement.setAttribute("opacity", opacity.toString());
  return pathElement;
};

interface RectObfuscationParams extends ObfuscationParams {
  originalFill: string;
  x: number;
  y: number;
  width: number;
  height: number;
  elements: SVGElement[];
}
