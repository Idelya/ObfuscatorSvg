import { divideCircle } from "./circleObfuscation";
import { ObfuscationParams } from "./obfuscationParams";
import { dividePolygon } from "./polygonObfuscation";
import { divideRect } from "./rectObfuscation";

export const obfuscate = (svgElement: string, params: ObfuscationParams) => {
  const resultSvg = new DOMParser().parseFromString(svgElement, "image/svg+xml")
    .documentElement as unknown as SVGElement;

  resultSvg.childNodes.forEach((elem) => {
    const svgChild = elem as SVGElement;
    if (svgChild.tagName === "circle") {
      replaceFigure(svgChild, (svg) => divideCircle(svg, params));
    } else if (svgChild.tagName === "rect") {
      replaceFigure(svgChild, (svg) => divideRect(svg, params));
    } else if (svgChild.tagName === "polygon") {
      replaceFigure(svgChild, (svg) => dividePolygon(svg, params));
    } else {
      throw elem;
    }
  });

  const svgAsStr = new XMLSerializer().serializeToString(resultSvg);
  return svgAsStr;
};

const replaceFigure = (
  svgElement: SVGElement,
  obfuscation: (element: SVGElement, params: ObfuscationParams) => SVGElement[],
) => {
  const dividedSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );

  const params: ObfuscationParams = {
    divisionStrength: 3,
    circleParts: 360,
    elementTag: "path",
    addIrrelevantFigures: true,
    addIrrelevantAttributes: true,
    randomizeElements: true,
    figureSplitBy: "opacity",
    fillType: "original",
  };
  const childNodes = obfuscation(svgElement, params);
  dividedSvg.innerHTML = childNodes
    .map((element) => element.outerHTML)
    .join("");

  if (params.addIrrelevantFigures) {
    dividedSvg.appendChild(getObfuscatedSvgStyleTag());
  }

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
