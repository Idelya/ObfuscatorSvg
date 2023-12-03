export const deleteStyles = (svgAsString: string) => {
  const svgElement = new DOMParser().parseFromString(
    svgAsString,
    "image/svg+xml",
  ).documentElement as unknown as SVGElement;

  const styleArray = Array.from(svgElement.getElementsByTagName("style"));

  styleArray.forEach((styleElement) => {
    if (styleElement.parentNode) {
      styleElement?.parentNode.removeChild(styleElement);
    }
  });
  const resSvgAsStr = new XMLSerializer().serializeToString(svgElement);
  return resSvgAsStr;
};
