import { ObfuscationParams } from "./obfuscationParams";
import { addIrrelevantFiguresTo, getRandomFigure, setFigureColor } from "./sharedObfuscation";
import { ceilTo1, getRandomInt, shuffle } from "./utils";

const STROKE_WIDTH = 1;

export const divideCircle = (circleSvg: SVGElement, params: ObfuscationParams) => {
  const r = parseInt(circleSvg.getAttribute("r")!);
  const cx = parseInt(circleSvg.getAttribute("cx")!);
  const cy = parseInt(circleSvg.getAttribute("cy")!);
  const originalFill = circleSvg.getAttribute("fill")!;

  const circleParams = { cx, cy, diameter: 2 * r, originalFill, ...params };

  const circleElements = getDividedCircleElements(circleParams);

  if (params.addIrrelevantFigures) {
    addIrrelevantFiguresTo(circleElements, cx, cy, r, r);
  }
  if (params.randomizeElements) {
    shuffle(circleElements);
  }

  if (params.addIrrelevantFigures) {
    circleElements.unshift(getRandomFigure(cx - r, cy - r, 2 * r, 2 * r, 2 * r, 2 * r));
    circleElements.push(getRandomFigure(cx - r, cy - r, 2 * r, 2 * r, 2 * r, 2 * r));
  }

  return circleElements;
};

const getSectorPath = (outerDiameter: number, x: number, y: number, angleStart: number, angleEnd: number) => {
  const degreesToRadiansRatio = Math.PI / 180;
  const cr = outerDiameter / 2;
  const cx1 = Math.cos(degreesToRadiansRatio * angleEnd) * cr + x;
  const cy1 = -Math.sin(degreesToRadiansRatio * angleEnd) * cr + y;
  const cx2 = Math.cos(degreesToRadiansRatio * angleStart) * cr + x;
  const cy2 = -Math.sin(degreesToRadiansRatio * angleStart) * cr + y;

  return `M${x} ${y} ${cx1} ${cy1} A${cr} ${cr} 0 0 1 ${cx2} ${cy2}Z`;
};

const getDividedCircleElements = (params: CircleObfuscationParams) => {
  const angle = 360 / params.divisionStrength;
  let paths: SVGElement[] = [];
  for (let i = 0; i < params.divisionStrength; i++) {
    paths = paths.concat(createCompletedCircleSector(i, angle, params));
  }
  return paths;
};

const createCompletedCircleSector = (i: number, angle: number, params: CircleObfuscationParams) => {
  if (params.figureSplitBy === "opacity") {
    const opacity = getRandomInt(1, 100) / 50;
    const leftOpacity = 2 - opacity;
    return [
      createPartialCircleSector(i * angle, (i + 1) * angle, ceilTo1(opacity), params),
      createPartialCircleSector(i * angle, (i + 1) * angle, ceilTo1(leftOpacity), params),
    ];
  }
  return [createPartialCircleSector(i * angle, (i + 1) * angle, 1, params)];
};

const createPartialCircleSector = (angleStart: number, angleEnd: number, opacity: number, params: CircleObfuscationParams) => {
  const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
  if (params.addIrrelevantAttributes) {
    const fakeWidth = getRandomInt(1, params.diameter);
    const fakeHeight = getRandomInt(1, params.diameter);
    pathElement.setAttribute("width", fakeWidth.toString());
    pathElement.setAttribute("height", fakeHeight.toString());
  }
  pathElement.setAttribute("d", getSectorPath(params.diameter, params.cx, params.cy, angleStart, angleEnd));
  setFigureColor(pathElement, params, params.originalFill);
  pathElement.setAttribute("stroke-width", STROKE_WIDTH.toString());
  pathElement.setAttribute("opacity", opacity.toString());
  return pathElement;
};

interface CircleObfuscationParams extends ObfuscationParams {
  diameter: number;
  cx: number;
  cy: number;
  originalFill: string;
}
