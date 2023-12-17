export const combineRects = (groupSvg: SVGGElement) => {
  const elements: SVGRectElement[] = Array.from(
    groupSvg.querySelectorAll("rect"),
  );
  // assume there are no additional
  // no transformation applied
  // only original rects

  const minX = elements.reduce((minXCoord, svgRect) => {
    const rectX = svgRect.x.baseVal.value;
    return rectX < minXCoord ? rectX : minXCoord;
  }, elements[0].x.baseVal.value);

  const minY = elements.reduce((minYCoord, svgRect) => {
    const rectY = svgRect.y.baseVal.value;
    return rectY < minYCoord ? rectY : minYCoord;
  }, elements[0].y.baseVal.value);

  const maxX = elements.reduce((maxXCoord, svgRect) => {
    const rectX = svgRect.x.baseVal.value + svgRect.width.baseVal.value;
    return rectX > maxXCoord ? rectX : maxXCoord;
  }, elements[0].x.baseVal.value + elements[0].width.baseVal.value);

  const maxY = elements.reduce((maxYCoord, svgRect) => {
    const rectY = svgRect.y.baseVal.value + svgRect.height.baseVal.value;
    return rectY > maxYCoord ? rectY : maxYCoord;
  }, elements[0].y.baseVal.value + elements[0].height.baseVal.value);

  const result = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  console.log(result);
  return result;
};
