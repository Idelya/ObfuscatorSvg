import { DeobfuscateParams } from "./deobfuscateParams";

export const deobfuscate = (svgElement: string, params: DeobfuscateParams) => {
  const resultSvg = new DOMParser().parseFromString(svgElement, "image/svg+xml")
    .documentElement as unknown as SVGElement;

  if (params.removeUnnecessaryAttributes) {
    removeUnnecessaryAttributes(resultSvg);
  }

  const svgAsStr = new XMLSerializer().serializeToString(resultSvg);
  return svgAsStr;
};

const removeUnnecessaryAttributes = (svg: SVGElement) => {
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  if (svg.hasChildNodes()) {
    svg.childNodes.forEach((node) =>
      removeUnnecessaryAttributes(node as SVGElement),
    );
  }
};
