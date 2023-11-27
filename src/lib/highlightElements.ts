import { getRandomHexColor } from "../obfuscationMethods/utils";

const setOpacityAndRandomColor = (svgElement: SVGElement) => {
  if (svgElement.childNodes.length) {
    svgElement.childNodes.forEach((elem) => {
      const svgChild = elem as SVGElement;
      if (svgChild.nodeType === Node.ELEMENT_NODE) {
        svgChild.setAttribute("opacity", "1");
        svgChild.setAttribute("fill", getRandomHexColor() + "AA");
        setOpacityAndRandomColor(svgChild);
      }
    });
  }
};

export const highlightSvgElements = (svgAsString: string) => {
  const svgElement = new DOMParser().parseFromString(
    svgAsString,
    "image/svg+xml",
  ).documentElement as unknown as SVGElement;

  setOpacityAndRandomColor(svgElement);

  const resSvgAsStr = new XMLSerializer().serializeToString(svgElement);
  return resSvgAsStr;
};
