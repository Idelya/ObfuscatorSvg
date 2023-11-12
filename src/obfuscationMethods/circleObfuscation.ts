import { shuffle, getRandomFigure } from "./utils";

const PARTS_COUNT = 360;
const STROKE_WIDTH = 1;

export const divideCircle = (circleSvg: SVGElement) => {
    const r = parseInt(circleSvg.getAttribute("r")!);
    const cx = parseInt(circleSvg.getAttribute("cx")!);
    const cy = parseInt(circleSvg.getAttribute("cy")!);
    const fill = circleSvg.getAttribute("fill");

    const circleElements = getDividedCircleElements(r, cx, cy, fill, PARTS_COUNT);

    // TODO: Add elements in the middle
    circleElements.unshift(getRandomFigure(cx-r, cy-r, 2*r, 2*r, 2*r, 2*r));
    circleElements.push(getRandomFigure(cx-r, cy-r, 2*r, 2*r, 2*r, 2*r));

    return circleElements;
}

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
    const paths: SVGElement[] = [];
    for (let i = 0; i < partsCount; i++){
        var pathElement = document.createElementNS("http://www.w3.org/2000/svg", "path");
        pathElement.setAttribute("d", getSectorPath(diameter, cx, cy, i*angle, (i+1)*angle));
        pathElement.setAttribute("fill", fill);
        pathElement.setAttribute("stroke", fill);
        pathElement.setAttribute("stroke-width", STROKE_WIDTH);
        paths.push(pathElement);
    }
    shuffle(paths);
    return paths;
}
