import { ELEMENT_TAG_PARAMS, ObfuscationParams } from "./obfuscationParams";
import { Point } from "./point";
import {
  addIrrelevantFiguresTo,
  getRandomFigure,
  setFigureColor,
} from "./sharedObfuscation";
import {
  ceilTo1,
  getRandomInt,
  getRandomPointInsidePolygon,
  shuffle,
} from "./utils";

const STROKE_WIDTH = 1;
const GLASS_METHOD_PROBABILITY = 0.5;

interface PolygonObfuscationParams extends ObfuscationParams {
  width: number;
  height: number;
  x: number;
  y: number;
  originalFill: string;
  elements: SVGElement[];
}

export const dividePolygon = (
  polygonSvg: SVGElement,
  params: ObfuscationParams,
) => {
  const width = parseInt(polygonSvg.getAttribute("width")!);
  const height = parseInt(polygonSvg.getAttribute("height")!);
  const originalFill = polygonSvg.getAttribute("fill")!;

  const polygonParams: PolygonObfuscationParams = {
    ...params,
    width,
    height,
    x: 0,
    y: 0,
    originalFill,
    elements: [],
  };

  getDividedPolygonElements(polygonParams);

  if (params.addIrrelevantFigures) {
    addIrrelevantFiguresTo(
      polygonParams.elements,
      width / 2,
      height / 2,
      width / 2,
      height / 2,
    );
  }
  if (params.randomizeElements) {
    shuffle(polygonParams.elements);
  }

  if (params.addIrrelevantFigures) {
    polygonParams.elements.unshift(
      getRandomFigure(0, 0, width, width, height, height),
    );
    polygonParams.elements.push(
      getRandomFigure(0, 0, width, width, height, height),
    );
  }

  return polygonParams.elements;
};

const getDividedPolygonElements = (params: PolygonObfuscationParams) => {
  const innerElements: SVGElement[] = [];
  if (params.elementTag === ELEMENT_TAG_PARAMS.PATH) {
    getDividedIntoPaths(params);
  } else {
    getDividedIntoPolygons(params);
  }
  return innerElements;
};

const getDividedIntoPaths = (params: PolygonObfuscationParams) => {
  if (params.divisionStrength > 1) {
    getDividedIntoPaths({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width / 2,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedIntoPaths({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      y: params.y + params.height,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedIntoPaths({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width,
      y: params.y + params.height,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedIntoReversedPaths({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width / 2,
      y: params.y + params.height,
      divisionStrength: params.divisionStrength - 1,
    });
  } else {
    const changeToGlass = () =>
      params.glassEnabled && Math.random() < GLASS_METHOD_PROBABILITY;

    let point1 = { x: params.x / 2 + params.width / 2, y: params.y / 2 };
    let point2 = {
      x: params.x / 2 + params.width / 4,
      y: params.y / 2 + params.height / 2,
    };
    let point3 = {
      x: params.x / 2 + (3 * params.width) / 4,
      y: params.y / 2 + params.height / 2,
    };
    // Top part
    if (changeToGlass()) {
      buildPolygonGlass(
        { ...point1 },
        { ...point2 },
        { ...point3 },
        { ...params },
      );
    } else {
      createCompletedPath(
        params.originalFill,
        point1,
        point2,
        point3,
        params,
      ).forEach((p) => params.elements.push(p));
      point1 = {
        x: params.x / 2 + params.width / 4,
        y: params.y / 2 + params.height / 2,
      };
    }
    point1 = {
      x: params.x / 2 + params.width / 4,
      y: params.y / 2 + +params.height / 2,
    };
    point2 = { x: params.x / 2, y: params.y / 2 + params.height };
    point3 = {
      x: params.x / 2 + params.width / 2,
      y: params.y / 2 + params.height,
    };
    // Left
    if (changeToGlass()) {
      buildPolygonGlass(
        { ...point1 },
        { ...point2 },
        { ...point3 },
        { ...params },
      );
    } else {
      createCompletedPath(
        params.originalFill,
        point1,
        point2,
        point3,
        params,
      ).forEach((p) => params.elements.push(p));
    }
    point1 = {
      x: params.x / 2 + (3 * params.width) / 4,
      y: params.y / 2 + params.height / 2,
    };
    point2 = {
      x: params.x / 2 + params.width / 2,
      y: params.y / 2 + params.height,
    };
    point3 = {
      x: params.x / 2 + params.width,
      y: params.y / 2 + params.height,
    };
    // Right
    if (changeToGlass()) {
      buildPolygonGlass(
        { ...point1 },
        { ...point2 },
        { ...point3 },
        { ...params },
      );
    } else {
      createCompletedPath(
        params.originalFill,
        point1,
        point2,
        point3,
        params,
      ).forEach((p) => params.elements.push(p));
    }
    point1 = {
      x: params.x / 2 + params.width / 2,
      y: params.y / 2 + params.height,
    };
    point2 = {
      x: params.x / 2 + params.width / 4,
      y: params.y / 2 + params.height / 2,
    };
    point3 = {
      x: params.x / 2 + (3 * params.width) / 4,
      y: params.y / 2 + params.height / 2,
    };
    // Middle
    if (changeToGlass()) {
      buildPolygonGlass(
        { ...point1 },
        { ...point2 },
        { ...point3 },
        { ...params },
      );
    } else {
      createCompletedPath(
        params.originalFill,
        point1,
        point2,
        point3,
        params,
      ).forEach((p) => params.elements.push(p));
    }
  }
};

const getDividedIntoReversedPaths = (params: PolygonObfuscationParams) => {
  if (params.divisionStrength > 1) {
    getDividedIntoPaths({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width / 2,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedIntoReversedPaths({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedIntoReversedPaths({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedIntoReversedPaths({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width / 2,
      y: params.y + params.height,
      divisionStrength: params.divisionStrength - 1,
    });
  } else {
    const changeToGlass = () =>
      params.glassEnabled && Math.random() < GLASS_METHOD_PROBABILITY;

    // TODO: Label
    if (changeToGlass() && false) {
      // TODO: buildPolygonGlass
    } else {
      createCompletedPath(
        params.originalFill,
        { x: params.x / 2 + params.width / 2, y: params.y / 2 + params.height },
        {
          x: params.x / 2 + params.width / 4,
          y: params.y / 2 + params.height / 2,
        },
        {
          x: params.x / 2 + (3 * params.width) / 4,
          y: params.y / 2 + params.height / 2,
        },
        params,
      ).forEach((p) => params.elements.push(p));
    }

    // TODO: Label
    if (changeToGlass() && false) {
      // TODO: buildPolygonGlass
    } else {
      createCompletedPath(
        params.originalFill,
        {
          x: params.x / 2 + params.width / 4,
          y: params.y / 2 + params.height / 2,
        },
        { x: params.x / 2, y: params.y / 2 },
        { x: params.x / 2 + params.width / 2, y: params.y / 2 },
        params,
      ).forEach((p) => params.elements.push(p));
    }
    // TODO: Label
    if (changeToGlass() && false) {
      // TODO: buildPolygonGlass
    } else {
      createCompletedPath(
        params.originalFill,
        {
          x: params.x / 2 + (3 * params.width) / 4,
          y: params.y / 2 + params.height / 2,
        },
        { x: params.x / 2 + params.width / 2, y: params.y / 2 },
        { x: params.x / 2 + params.width, y: params.y / 2 },
        params,
      ).forEach((p) => params.elements.push(p));
    }
    // TODO: Label
    if (changeToGlass() && false) {
      // TODO: buildPolygonGlass
    } else {
      createCompletedPath(
        params.originalFill,
        { x: params.x / 2 + params.width / 2, y: params.y / 2 },
        {
          x: params.x / 2 + params.width / 4,
          y: params.y / 2 + params.height / 2,
        },
        {
          x: params.x / 2 + (3 * params.width) / 4,
          y: params.y / 2 + params.height / 2,
        },
        params,
      ).forEach((p) => params.elements.push(p));
    }
  }
};

const buildPolygonGlass = (
  point1: Point,
  point2: Point,
  point3: Point,
  params: PolygonObfuscationParams,
) => {
  const centerPoint = getRandomPointInsidePolygon(point1, point2, point3);

  //left triangle
  params.elements.push(createTriangle(point1, centerPoint, point2, params));

  // right triangle
  params.elements.push(createTriangle(point1, centerPoint, point3, params));

  // bottom triangle
  params.elements.push(createTriangle(point2, centerPoint, point3, params));
};

const createTriangle = (
  point1: Point,
  point2: Point,
  point3: Point,
  params: PolygonObfuscationParams,
) => {
  const triangle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon",
  );
  triangle.setAttribute(
    "points",
    `${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y}`,
  );
  setFigureColor(triangle, params, params.originalFill);
  triangle.setAttribute("stroke-width", STROKE_WIDTH.toString());
  return triangle;
};

const createCompletedPath = (
  fill: string,
  point1: Point,
  point2: Point,
  point3: Point,
  params: ObfuscationParams,
) => {
  if (params.figureSplitBy === "opacity") {
    const opacity = getRandomInt(1, 100) / 50;
    const leftOpacity = 2 - opacity;
    return [
      createPartialPath(fill, ceilTo1(opacity), point1, point2, point3, params),
      createPartialPath(
        fill,
        ceilTo1(leftOpacity),
        point1,
        point2,
        point3,
        params,
      ),
    ];
  }
  return [createPartialPath(fill, 1, point1, point2, point3, params)];
};

const createPartialPath = (
  fill: string,
  opacity: number,
  point1: Point,
  point2: Point,
  point3: Point,
  params: ObfuscationParams,
) => {
  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );
  if (params.addIrrelevantAttributes) {
    const fakeWidth = getRandomInt(1, point1.x);
    const fakeHeight = getRandomInt(1, point1.y);
    pathElement.setAttribute("widht", fakeWidth.toString());
    pathElement.setAttribute("heigth", fakeHeight.toString());
  }
  pathElement.setAttribute(
    "d",
    `M${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y} Z`,
  );
  setFigureColor(pathElement, params, fill);
  pathElement.setAttribute("stroke-width", STROKE_WIDTH.toString());
  pathElement.setAttribute("opacity", opacity.toString());
  return pathElement;
};

const getDividedIntoPolygons = (params: PolygonObfuscationParams) => {
  if (params.divisionStrength > 1) {
    getDividedIntoPolygons({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width / 2,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedIntoPolygons({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      y: params.y + params.height,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedIntoPolygons({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width,
      y: params.y + params.height,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedIntoReversedPolygons({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width / 2,
      y: params.y + params.height,
      divisionStrength: params.divisionStrength - 1,
    });
  } else {
    createCompletedPolygon(
      params.originalFill,
      { x: params.x / 2 + params.width / 2, y: params.y / 2 },
      {
        x: params.x / 2 + params.width / 4,
        y: params.y / 2 + params.height / 2,
      },
      {
        x: params.x / 2 + (3 * params.width) / 4,
        y: params.y / 2 + params.height / 2,
      },
      params,
    ).forEach((p) => params.elements.push(p));
    createCompletedPolygon(
      params.originalFill,
      {
        x: params.x / 2 + params.width / 4,
        y: params.y / 2 + params.height / 2,
      },
      { x: params.x / 2, y: params.y / 2 + params.height },
      { x: params.x / 2 + params.width / 2, y: params.y / 2 + params.height },
      params,
    ).forEach((p) => params.elements.push(p));
    createCompletedPolygon(
      params.originalFill,
      {
        x: params.x / 2 + (3 * params.width) / 4,
        y: params.y / 2 + params.height / 2,
      },
      { x: params.x / 2 + params.width / 2, y: params.y / 2 + params.height },
      { x: params.x / 2 + params.width, y: params.y / 2 + params.height },
      params,
    ).forEach((p) => params.elements.push(p));
    createCompletedPolygon(
      params.originalFill,
      { x: params.x / 2 + params.width / 2, y: params.y / 2 + params.height },
      {
        x: params.x / 2 + params.width / 4,
        y: params.y / 2 + params.height / 2,
      },
      {
        x: params.x / 2 + (3 * params.width) / 4,
        y: params.y / 2 + params.height / 2,
      },
      params,
    ).forEach((p) => params.elements.push(p));
  }
};

const getDividedIntoReversedPolygons = (params: PolygonObfuscationParams) => {
  if (params.divisionStrength > 1) {
    getDividedIntoPolygons({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width / 2,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedIntoReversedPolygons({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedIntoReversedPolygons({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width,
      divisionStrength: params.divisionStrength - 1,
    });
    getDividedIntoReversedPolygons({
      ...params,
      width: params.width / 2,
      height: params.height / 2,
      x: params.x + params.width / 2,
      y: params.y + params.height,
      divisionStrength: params.divisionStrength - 1,
    });
  } else {
    createCompletedPolygon(
      params.originalFill,
      { x: params.x / 2 + params.width / 2, y: params.y / 2 + params.height },
      {
        x: params.x / 2 + params.width / 4,
        y: params.y / 2 + params.height / 2,
      },
      {
        x: params.x / 2 + (3 * params.width) / 4,
        y: params.y / 2 + params.height / 2,
      },
      params,
    ).forEach((p) => params.elements.push(p));
    createCompletedPolygon(
      params.originalFill,
      {
        x: params.x / 2 + params.width / 4,
        y: params.y / 2 + params.height / 2,
      },
      { x: params.x / 2, y: params.y / 2 },
      { x: params.x / 2 + params.width / 2, y: params.y / 2 },
      params,
    ).forEach((p) => params.elements.push(p));
    createCompletedPolygon(
      params.originalFill,
      {
        x: params.x / 2 + (3 * params.width) / 4,
        y: params.y / 2 + params.height / 2,
      },
      { x: params.x / 2 + params.width / 2, y: params.y / 2 },
      { x: params.x / 2 + params.width, y: params.y / 2 },
      params,
    ).forEach((p) => params.elements.push(p));
    createCompletedPolygon(
      params.originalFill,
      { x: params.x / 2 + params.width / 2, y: params.y / 2 },
      {
        x: params.x / 2 + params.width / 4,
        y: params.y / 2 + params.height / 2,
      },
      {
        x: params.x / 2 + (3 * params.width) / 4,
        y: params.y / 2 + params.height / 2,
      },
      params,
    ).forEach((p) => params.elements.push(p));
  }
};

const createCompletedPolygon = (
  fill: string,
  point1: Point,
  point2: Point,
  point3: Point,
  params: ObfuscationParams,
) => {
  if (params.addIrrelevantAttributes) {
    const opacity = getRandomInt(1, 100) / 50;
    const leftOpacity = 2 - opacity;
    return [
      createPartialPolygon(
        fill,
        ceilTo1(opacity),
        point1,
        point2,
        point3,
        params,
      ),
      createPartialPolygon(
        fill,
        ceilTo1(leftOpacity),
        point1,
        point2,
        point3,
        params,
      ),
    ];
  }
  return [createPartialPolygon(fill, 1, point1, point2, point3, params)];
};

const createPartialPolygon = (
  fill: string,
  opacity: number,
  point1: Point,
  point2: Point,
  point3: Point,
  params: ObfuscationParams,
) => {
  const polygonElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon",
  );
  if (params.addIrrelevantAttributes) {
    const fakeWidth = getRandomInt(1, point1.x);
    const fakeHeight = getRandomInt(1, point1.y);
    polygonElement.setAttribute("widht", fakeWidth.toString());
    polygonElement.setAttribute("heigth", fakeHeight.toString());
  }
  polygonElement.setAttribute(
    "points",
    `${point1.x},${point1.y} ${point2.x},${point2.y} ${point3.x},${point3.y}`,
  );
  setFigureColor(polygonElement, params, fill);
  polygonElement.setAttribute("stroke-width", STROKE_WIDTH.toString());
  polygonElement.setAttribute("opacity", opacity.toString());
  return polygonElement;
};
