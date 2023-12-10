import { divideCircle } from "./circleObfuscation";
import {
  styleTransformCircle,
  styleTransformPolygon,
  styleTransformRect,
} from "./obfuscationByStyle";
import { ObfuscationParams } from "./obfuscationParams";
import { dividePolygon } from "./polygonObfuscation";
import { divideRect } from "./rectObfuscation";

export const obfuscate = (svgElement: string, params: ObfuscationParams) => {
  const resultSvg = new DOMParser().parseFromString(svgElement, "image/svg+xml")
    .documentElement as unknown as SVGElement;

  resultSvg.childNodes.forEach((elem) => {
    const svgChild = elem as SVGElement;
    if (svgChild.tagName === "circle") {
      replaceFigure(svgChild, params, divideCircle, styleTransformCircle);
    } else if (svgChild.tagName === "rect") {
      replaceFigure(svgChild, params, divideRect, styleTransformRect);
    } else if (svgChild.tagName === "polygon") {
      replaceFigure(svgChild, params, dividePolygon, styleTransformPolygon);
    } else {
      throw elem;
    }
  });

  const svgAsStr = new XMLSerializer().serializeToString(resultSvg);
  return svgAsStr;
};

const replaceFigure = (
  svgElement: SVGElement,
  params: ObfuscationParams,
  obfuscation: (element: SVGElement, params: ObfuscationParams) => SVGElement[],
  transform?: (element: SVGElement) => void,
) => {
  const dividedSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );

  const childNodes = obfuscation(svgElement, params);
  dividedSvg.innerHTML = childNodes
    .map((element) => element.outerHTML)
    .join("");

  if (params.addIrrelevantFigures) {
    dividedSvg.appendChild(getObfuscatedSvgStyleTag());
  }
  if (transform && params.transformEnable) {
    transform(dividedSvg);
  }

  dividedSvg.childNodes.forEach((element) => {
    (element as SVGElement).removeAttribute("origin");
  });

  svgElement.parentNode?.replaceChild(dividedSvg, svgElement);
};

const getObfuscatedSvgStyleTag = () => {
  const styleElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "style",
  );

  styleElement.textContent = `
    .red {
      display: none;
    }
  `;

  return styleElement;
};
