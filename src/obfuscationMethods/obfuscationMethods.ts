import { divideCircle } from "./circleObfuscation";
import { dividePolygon } from "./polygonObfuscation";
import { divideRect } from "./rectObfuscation";

type ObfuscationMethod = (svg: SVGElement) => SVGElement;

type obfuscatiorMethodNames = (keyof typeof obfuscationMethods)[];

export const obfuscate = (
  svgElement: string,
  methods: obfuscatiorMethodNames,
) => {
  let resultSvg = new DOMParser().parseFromString(svgElement, "image/svg+xml")
    .documentElement as unknown as SVGElement;

  methods.forEach((method) => {
    resultSvg = obfuscationMethods[method](resultSvg);
  });

  const svgAsStr = new XMLSerializer().serializeToString(resultSvg);
  return svgAsStr;
};

export const obfuscationMethods: { [key: string]: ObfuscationMethod } = {
  "divide into parts, randomize, change to paths, add irrelevant attributes": (svg: SVGElement) => {
    svg.childNodes.forEach((elem, _) => {
      const svgChild = elem as SVGElement;
      if (svgChild.tagName === "circle"){
        replaceFigure(svgChild, divideCircle);
      } else if (svgChild.tagName === "rect") {
        replaceFigure(svgChild, divideRect);
      } else if (svgChild.tagName === "polygon") {
        replaceFigure(svgChild, dividePolygon);
      } else {
        throw elem;
      }
    });
    return svg;
  }
};

const replaceFigure = (svgElement: SVGElement, obfuscation: Function) => {
  const devidedSvg = document.createElementNS("http://www.w3.org/2000/svg", "g");
  const childNodes = obfuscation(svgElement);
  devidedSvg.innerHTML = childNodes.map(element => element.outerHTML).join('');

  svgElement.parentNode?.replaceChild(devidedSvg, svgElement);
}
