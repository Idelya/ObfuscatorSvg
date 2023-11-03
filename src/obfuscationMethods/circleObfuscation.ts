import { shuffle } from "./utils";

const PARTS_COUNT = 360;

export const divideCircle = (circleSvg: SVGElement) => {
    const r = circleSvg.getAttribute("r");
    const cx = circleSvg.getAttribute("cx");
    const cy = circleSvg.getAttribute("cy");
    const fill = circleSvg.getAttribute("fill");

    // TODO: cx, cy
    const circleElements = getDividedCircleElements(r, fill, PARTS_COUNT);

    const newSvgContent = circleElements.join("");

    let devidedCircleSvg = document.createElementNS("http://www.w3.org/2000/svg", "g");
    devidedCircleSvg.innerHTML = newSvgContent;

    circleSvg.parentNode?.replaceChild(devidedCircleSvg, circleSvg);
}

const getSectorPath = (outerDiameter: number, angleStart: number, angleEnd: number) => {
    const x = outerDiameter / 2;
    const y = outerDiameter / 2;
    const degreesToRadiansRatio = Math.PI / 180;
    const cr = outerDiameter / 2;
    const cx1 = Math.cos(degreesToRadiansRatio * angleEnd) * cr + x;
    const cy1 = -Math.sin(degreesToRadiansRatio * angleEnd) * cr + y;
    const cx2 = Math.cos(degreesToRadiansRatio * angleStart) * cr + x;
    const cy2 = -Math.sin(degreesToRadiansRatio * angleStart) * cr + y;

    return `M${x} ${y} ${cx1} ${cy1} A${cr} ${cr} 0 0 1 ${cx2} ${cy2}Z`;
};  

const getDividedCircleElements = (radius: number, fill: string, partsCount: number) => {
    const diameter = radius * 2;
    const angle = 360 / partsCount;
    const paths = [];
    for (let i = 0; i < partsCount; i++){
        paths.push(`<path d="${getSectorPath(diameter, i*angle, (i+1)*angle)}" fill="${fill}" />`);
    }
    shuffle(paths);
    return paths;
}
