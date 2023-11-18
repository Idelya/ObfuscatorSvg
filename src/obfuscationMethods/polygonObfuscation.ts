import { ObfuscationParams } from "./obfuscationParams";
import { Point } from "./point";
import { addIrrelevantFiguresTo, getRandomFigure } from "./sharedObfuscation";
import { ceilTo1, getRandomInt, shuffle } from "./utils";

const STROKE_WIDTH = 1;

export const dividePolygon = (polygonSvg: SVGElement) => {
  // TODO: Add to parameter list
  // TODO: Extended params
  // TODO: Colors
  // TODO: Style inside g if add irrelevant
  const params: ObfuscationParams = {
    divisionStrength: 3,
    elementTag: "path",
    addIrrelevantFigures: true,
    addIrrelevantAttributes: true,
    randomizeElements: true,
    figureSplitBy: "opacity",
    fillType: "original",
  };

  const width = parseInt(polygonSvg.getAttribute("width")!);
  const height = parseInt(polygonSvg.getAttribute("height")!);
  const originalFill = polygonSvg.getAttribute("fill")!;

  const polygonElements = getDividedPolygonElements(width, height, originalFill, params);

  if (params.addIrrelevantFigures) {
    addIrrelevantFiguresTo(polygonElements, width / 2, height / 2, width / 2, height / 2);
  }
  if (params.randomizeElements) {
    shuffle(polygonElements);
  }

  if (params.addIrrelevantFigures) {
    polygonElements.unshift(getRandomFigure(0, 0, width, width, height, height));
    polygonElements.push(getRandomFigure(0, 0, width, width, height, height));
  }

  return polygonElements;
};

const getDividedPolygonElements = (width: number, height: number, fill: string, params: ObfuscationParams) => {
  const innerElements: SVGElement[] = [];
  if (params.elementTag === "path") {
    getDividedIntoPaths(width, height, 0, 0, params.divisionStrength, innerElements, fill, params);
  } else {
    getDividedIntoPolygons(width, height, 0, 0, params.divisionStrength, innerElements, fill, params);
  }
  return innerElements;
};

const getDividedIntoPaths = (
  width: number,
  height: number,
  xInit: number,
  yInit: number,
  depth: number,
  paths: SVGElement[],
  fill: string,
  params: ObfuscationParams,
) => {
  if (depth > 1) {
    getDividedIntoPaths(width / 2, height / 2, +xInit + width / 2, +yInit, depth - 1, paths, fill, params);
    getDividedIntoPaths(width / 2, height / 2, +xInit, +yInit + height, depth - 1, paths, fill, params);
    getDividedIntoPaths(width / 2, height / 2, +xInit + width, +yInit + height, depth - 1, paths, fill, params);
    getDividedIntoReversedPaths(width / 2, height / 2, +xInit + width / 2, +yInit + height, depth - 1, paths, fill, params);
  } else {
    let point1 = { x: xInit / 2 + width / 2, y: yInit / 2 };
    let point2 = { x: xInit / 2 + width / 4, y: yInit / 2 + height / 2 };
    let point3 = { x: xInit / 2 + (3 * width) / 4, y: yInit / 2 + height / 2 };
    createCompletedPath(fill, point1, point2, point3, params).forEach((p) => paths.push(p));
    point1 = { x: xInit / 2 + width / 4, y: yInit / 2 + height / 2 };
    point2 = { x: xInit / 2, y: yInit / 2 + height };
    point3 = { x: xInit / 2 + width / 2, y: yInit / 2 + height };
    createCompletedPath(fill, point1, point2, point3, params).forEach((p) => paths.push(p));
    point1 = { x: xInit / 2 + (3 * width) / 4, y: yInit / 2 + height / 2 };
    point2 = { x: xInit / 2 + width / 2, y: yInit / 2 + height };
    point3 = { x: xInit / 2 + width, y: yInit / 2 + height };
    createCompletedPath(fill, point1, point2, point3, params).forEach((p) => paths.push(p));
    point1 = { x: xInit / 2 + width / 2, y: yInit / 2 + height };
    point2 = { x: xInit / 2 + width / 4, y: yInit / 2 + height / 2 };
    point3 = { x: xInit / 2 + (3 * width) / 4, y: yInit / 2 + height / 2 };
    createCompletedPath(fill, point1, point2, point3, params).forEach((p) => paths.push(p));
  }
};

const getDividedIntoReversedPaths = (
  width: number,
  height: number,
  xInit: number,
  yInit: number,
  depth: number,
  paths: SVGElement[],
  fill: string,
  params: ObfuscationParams,
) => {
  xInit = +xInit;
  yInit = +yInit;
  if (depth > 1) {
    getDividedIntoPaths(width / 2, height / 2, +xInit + width / 2, +yInit, depth - 1, paths, fill, params);
    getDividedIntoReversedPaths(width / 2, height / 2, +xInit, +yInit, depth - 1, paths, fill, params);
    getDividedIntoReversedPaths(width / 2, height / 2, +xInit + width, +yInit, depth - 1, paths, fill, params);
    getDividedIntoReversedPaths(width / 2, height / 2, +xInit + width / 2, +yInit + height, depth - 1, paths, fill, params);
  } else {
    createCompletedPath(
      fill,
      { x: xInit / 2 + width / 2, y: yInit / 2 + height },
      { x: xInit / 2 + width / 4, y: yInit / 2 + height / 2 },
      { x: xInit / 2 + (3 * width) / 4, y: yInit / 2 + height / 2 },
      params,
    ).forEach((p) => paths.push(p));
    createCompletedPath(
      fill,
      { x: xInit / 2 + width / 4, y: yInit / 2 + height / 2 },
      { x: xInit / 2, y: yInit / 2 },
      { x: xInit / 2 + width / 2, y: yInit / 2 },
      params,
    ).forEach((p) => paths.push(p));
    createCompletedPath(
      fill,
      { x: xInit / 2 + (3 * width) / 4, y: yInit / 2 + height / 2 },
      { x: xInit / 2 + width / 2, y: yInit / 2 },
      { x: xInit / 2 + width, y: yInit / 2 },
      params,
    ).forEach((p) => paths.push(p));
    createCompletedPath(
      fill,
      { x: xInit / 2 + width / 2, y: yInit / 2 },
      { x: xInit / 2 + width / 4, y: yInit / 2 + height / 2 },
      { x: xInit / 2 + (3 * width) / 4, y: yInit / 2 + height / 2 },
      params,
    ).forEach((p) => paths.push(p));
  }
};

const createCompletedPath = (fill: string, point1: Point, point2: Point, point3: Point, params: ObfuscationParams) => {
  if (params.figureSplitBy === "opacity") {
    const opacity = getRandomInt(1, 100) / 50;
    const leftOpacity = 2 - opacity;
    return [
      createPartialPath(fill, ceilTo1(opacity), point1, point2, point3, params),
      createPartialPath(fill, ceilTo1(leftOpacity), point1, point2, point3, params),
    ];
  }
  return [createPartialPath(fill, 1, point1, point2, point3, params)];
};

const createPartialPath = (fill: string, opacity: number, point1: Point, point2: Point, point3: Point, params: ObfuscationParams) => {
  const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
  if (params.addIrrelevantAttributes) {
    const fakeWidth = getRandomInt(1, point1.x);
    const fakeHeight = getRandomInt(1, point1.y);
    pathElement.setAttribute("widht", fakeWidth.toString());
    pathElement.setAttribute("heigth", fakeHeight.toString());
  }
  pathElement.setAttribute("d", `M${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y} Z`);
  pathElement.setAttribute("fill", fill);
  pathElement.setAttribute("stroke", fill);
  pathElement.setAttribute("stroke-width", STROKE_WIDTH.toString());
  pathElement.setAttribute("opacity", opacity.toString());
  return pathElement;
};

const getDividedIntoPolygons = (
  width: number,
  height: number,
  xInit: number,
  yInit: number,
  depth: number,
  polygons: SVGElement[],
  fill: string,
  params: ObfuscationParams,
) => {
  if (depth > 1) {
    getDividedIntoPolygons(width / 2, height / 2, +xInit + width / 2, +yInit, depth - 1, polygons, fill, params);
    getDividedIntoPolygons(width / 2, height / 2, +xInit, +yInit + height, depth - 1, polygons, fill, params);
    getDividedIntoPolygons(width / 2, height / 2, +xInit + width, +yInit + height, depth - 1, polygons, fill, params);
    getDividedIntoReversedPolygons(width / 2, height / 2, +xInit + width / 2, +yInit + height, depth - 1, polygons, fill, params);
  } else {
    createCompletedPolygon(
      fill,
      { x: xInit / 2 + width / 2, y: yInit / 2 },
      { x: xInit / 2 + width / 4, y: yInit / 2 + height / 2 },
      { x: xInit / 2 + (3 * width) / 4, y: yInit / 2 + height / 2 },
      params,
    ).forEach((p) => polygons.push(p));
    createCompletedPolygon(
      fill,
      { x: xInit / 2 + width / 4, y: yInit / 2 + height / 2 },
      { x: xInit / 2, y: yInit / 2 + height },
      { x: xInit / 2 + width / 2, y: yInit / 2 + height },
      params,
    ).forEach((p) => polygons.push(p));
    createCompletedPolygon(
      fill,
      { x: xInit / 2 + (3 * width) / 4, y: yInit / 2 + height / 2 },
      { x: xInit / 2 + width / 2, y: yInit / 2 + height },
      { x: xInit / 2 + width, y: yInit / 2 + height },
      params,
    ).forEach((p) => polygons.push(p));
    createCompletedPolygon(
      fill,
      { x: xInit / 2 + width / 2, y: yInit / 2 + height },
      { x: xInit / 2 + width / 4, y: yInit / 2 + height / 2 },
      { x: xInit / 2 + (3 * width) / 4, y: yInit / 2 + height / 2 },
      params,
    ).forEach((p) => polygons.push(p));
  }
};

const getDividedIntoReversedPolygons = (
  width: number,
  height: number,
  xInit: number,
  yInit: number,
  depth: number,
  polygons: SVGElement[],
  fill: string,
  params: ObfuscationParams,
) => {
  xInit = +xInit;
  yInit = +yInit;
  if (depth > 1) {
    getDividedIntoPolygons(width / 2, height / 2, +xInit + width / 2, +yInit, depth - 1, polygons, fill, params);
    getDividedIntoReversedPolygons(width / 2, height / 2, +xInit, +yInit, depth - 1, polygons, fill, params);
    getDividedIntoReversedPolygons(width / 2, height / 2, +xInit + width, +yInit, depth - 1, polygons, fill, params);
    getDividedIntoReversedPolygons(width / 2, height / 2, +xInit + width / 2, +yInit + height, depth - 1, polygons, fill, params);
  } else {
    createCompletedPolygon(
      fill,
      { x: xInit / 2 + width / 2, y: yInit / 2 + height },
      { x: xInit / 2 + width / 4, y: yInit / 2 + height / 2 },
      { x: xInit / 2 + (3 * width) / 4, y: yInit / 2 + height / 2 },
      params,
    ).forEach((p) => polygons.push(p));
    createCompletedPolygon(
      fill,
      { x: xInit / 2 + width / 4, y: yInit / 2 + height / 2 },
      { x: xInit / 2, y: yInit / 2 },
      { x: xInit / 2 + width / 2, y: yInit / 2 },
      params,
    ).forEach((p) => polygons.push(p));
    createCompletedPolygon(
      fill,
      { x: xInit / 2 + (3 * width) / 4, y: yInit / 2 + height / 2 },
      { x: xInit / 2 + width / 2, y: yInit / 2 },
      { x: xInit / 2 + width, y: yInit / 2 },
      params,
    ).forEach((p) => polygons.push(p));
    createCompletedPolygon(
      fill,
      { x: xInit / 2 + width / 2, y: yInit / 2 },
      { x: xInit / 2 + width / 4, y: yInit / 2 + height / 2 },
      { x: xInit / 2 + (3 * width) / 4, y: yInit / 2 + height / 2 },
      params,
    ).forEach((p) => polygons.push(p));
  }
};

const createCompletedPolygon = (fill: string, point1: Point, point2: Point, point3: Point, params: ObfuscationParams) => {
  if (params.addIrrelevantAttributes) {
    const opacity = getRandomInt(1, 100) / 50;
    const leftOpacity = 2 - opacity;
    return [
      createPartialPolygon(fill, ceilTo1(opacity), point1, point2, point3, params),
      createPartialPolygon(fill, ceilTo1(leftOpacity), point1, point2, point3, params),
    ];
  }
  return [createPartialPolygon(fill, 1, point1, point2, point3, params)];
};

const createPartialPolygon = (fill: string, opacity: number, point1: Point, point2: Point, point3: Point, params: ObfuscationParams) => {
  const polygonElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
  if (params.addIrrelevantAttributes) {
    const fakeWidth = getRandomInt(1, point1.x);
    const fakeHeight = getRandomInt(1, point1.y);
    polygonElement.setAttribute("widht", fakeWidth.toString());
    polygonElement.setAttribute("heigth", fakeHeight.toString());
  }
  polygonElement.setAttribute("points", `${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y}`);
  polygonElement.setAttribute("fill", fill);
  polygonElement.setAttribute("stroke", fill);
  polygonElement.setAttribute("stroke-width", STROKE_WIDTH.toString());
  polygonElement.setAttribute("opacity", opacity.toString());
  return polygonElement;
};
