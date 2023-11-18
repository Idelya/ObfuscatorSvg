import { divideCircle } from "./circleObfuscation";
import { ObfuscationParams } from "./obfuscationParams";
import { dividePolygon } from "./polygonObfuscation";
import { divideRect } from "./rectObfuscation";

export const obfuscate = (svgElement: string) => {
  const resultSvg = new DOMParser().parseFromString(svgElement, "image/svg+xml").documentElement as unknown as SVGElement;

  resultSvg.childNodes.forEach((elem) => {
    const svgChild = elem as SVGElement;
    if (svgChild.tagName === "circle") {
      replaceFigure(svgChild, divideCircle);
    } else if (svgChild.tagName === "rect") {
      replaceFigure(svgChild, divideRect);
    } else if (svgChild.tagName === "polygon") {
      replaceFigure(svgChild, dividePolygon);
    } else {
      throw elem;
    }
  });

  const svgAsStr = new XMLSerializer().serializeToString(resultSvg);
  return svgAsStr;
};

const replaceFigure = (svgElement: SVGElement, obfuscation: (element: SVGElement, params: ObfuscationParams) => SVGElement[]) => {
  const dividedSvg = document.createElementNS("http://www.w3.org/2000/svg", "g");

  const params: ObfuscationParams = {
    divisionStrength: svgElement.tagName === "circle" ? 360 : 3,
    elementTag: "path",
    addIrrelevantFigures: true,
    addIrrelevantAttributes: true,
    randomizeElements: true,
    figureSplitBy: "opacity",
    fillType: "original",
  };
  const childNodes = obfuscation(svgElement, params);
  dividedSvg.innerHTML = childNodes.map((element) => element.outerHTML).join("");

  dividedSvg.appendChild(getObfuscatedSvgStyleTag());

  svgElement.parentNode?.replaceChild(dividedSvg, svgElement);
};

const getObfuscatedSvgStyleTag = () => {
  const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");

  styleElement.textContent = `
    .red {
      display: none;
    }
  `;

  return styleElement;
};
