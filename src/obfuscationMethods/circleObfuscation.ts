import { addIrrelevantFiguresTo, getRandomFigure } from "./sharedObfuscation";
import { ceilTo1, getRandomInt, shuffle } from "./utils";

const PARTS_COUNT = 360;
const STROKE_WIDTH = 1;

export const divideCircle = (circleSvg: SVGElement) => {
  const r = parseInt(circleSvg.getAttribute("r")!);
  const cx = parseInt(circleSvg.getAttribute("cx")!);
  const cy = parseInt(circleSvg.getAttribute("cy")!);
  const fill = circleSvg.getAttribute("fill")!;

  const circleElements = getDividedCircleElements(r, cx, cy, fill, PARTS_COUNT);

  addIrrelevantFiguresTo(circleElements, cx, cy, r, r);
  shuffle(circleElements);

  circleElements.unshift(getRandomFigure(cx - r, cy - r, 2 * r, 2 * r, 2 * r, 2 * r));
  circleElements.push(getRandomFigure(cx - r, cy - r, 2 * r, 2 * r, 2 * r, 2 * r));

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

const getDividedCircleElements = (radius: number, cx: number, cy: number, fill: string, partsCount: number) => {
  const diameter = radius * 2;
  const angle = 360 / partsCount;
  let paths: SVGElement[] = [];
  for (let i = 0; i < partsCount; i++) {
    paths = paths.concat(createCompletedCircleSector(diameter, cx, cy, i, angle, fill));
  }
  return paths;
};

const createCompletedCircleSector = (diameter: number, cx: number, cy: number, i: number, angle: number, fill: string) => {
  const opacity = getRandomInt(1, 100) / 50;
  const leftOpacity = 2 - opacity;
  return [
    createPartialCircleSector(diameter, cx, cy, i * angle, (i + 1) * angle, fill, ceilTo1(opacity)),
    createPartialCircleSector(diameter, cx, cy, i * angle, (i + 1) * angle, fill, ceilTo1(leftOpacity)),
  ];
};

const createPartialCircleSector = (diameter: number, cx: number, cy: number, angleStart: number, angleEnd: number, fill: string, opacity: number) => {
  const fakeWidth = getRandomInt(1, diameter);
  const fakeHeight = getRandomInt(1, diameter);
  const pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathElement.setAttribute("width", fakeWidth.toString());
  pathElement.setAttribute("height", fakeHeight.toString());
  pathElement.setAttribute("d", getSectorPath(diameter, cx, cy, angleStart, angleEnd));
  pathElement.setAttribute("fill", fill);
  pathElement.setAttribute("stroke", fill);
  pathElement.setAttribute("stroke-width", STROKE_WIDTH.toString());
  pathElement.setAttribute("opacity", opacity.toString());
  return pathElement;
};
