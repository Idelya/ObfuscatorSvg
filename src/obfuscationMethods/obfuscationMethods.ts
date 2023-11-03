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
  "divide into parts, randomize, change to paths": (svg: SVGElement) => {
    svg.childNodes.forEach((elem, _) => {
      const svgChild = elem as SVGElement;
      if (svgChild.tagName === "circle"){
        divideCircle(svgChild);
      } else if (svgChild.tagName === "rect") {
        divideRect(svgChild, svg);
      } else if (svgChild.tagName === "polygon") {
        dividePolygon(svgChild);
      } else {
        throw elem;
      }
    });
    return svg;
  }
};
