import { ObfuscationParametrs } from "../constant";
import { divideCircle } from "./circleObfuscation";
import { dividePolygon } from "./polygonObfuscation";
import { divideRect } from "./rectObfuscation";

export const obfuscate = (svgElement: string, params: ObfuscationParametrs) => {
  const resultSvg = new DOMParser().parseFromString(svgElement, "image/svg+xml")
    .documentElement as unknown as SVGElement;

  resultSvg.childNodes.forEach((elem) => {
    const svgChild = elem as SVGElement;
    if (svgChild.tagName === "circle") {
      replaceFigure(svgChild, (svg) =>
        divideCircle(svg, params.circleDivision),
      );
    } else if (svgChild.tagName === "rect") {
      replaceFigure(svgChild, (svg) =>
        divideRect(svg, params.rectDivisionDepth),
      );
    } else if (svgChild.tagName === "polygon") {
      replaceFigure(svgChild, (svg) =>
        dividePolygon(svg, params.polygonDivisionDepth),
      );
    } else {
      throw elem;
    }
  });

  const svgAsStr = new XMLSerializer().serializeToString(resultSvg);
  return svgAsStr;
};

const replaceFigure = (
  svgElement: SVGElement,
  obfuscation: (element: SVGElement) => SVGElement[],
) => {
  const dividedSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "g",
  );

  const childNodes = obfuscation(svgElement);
  dividedSvg.innerHTML = childNodes
    .map((element) => element.outerHTML)
    .join("");

  dividedSvg.appendChild(getObfuscatedSvgStyleTag());

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
