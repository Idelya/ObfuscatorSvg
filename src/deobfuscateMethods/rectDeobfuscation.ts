import { ConcatenationResult } from "./concatenationResult";

export const tryConcatenateRect = (groupSvg: SVGGElement) => {
  const rectsConcatenationResult: ConcatenationResult =
    getDimensionsFromRects(groupSvg);
  if (rectsConcatenationResult.succeded) {
    return rectsConcatenationResult;
  }
  const pathsConcatenationResult: ConcatenationResult =
    getDimensionsFromPaths(groupSvg);
  return pathsConcatenationResult;
};

const getDimensionsFromRects = (groupSvg: SVGGElement) => {
  const rectElements: SVGRectElement[] = Array.from(
    groupSvg.querySelectorAll("rect"),
  );

  if (groupSvg.children.length !== rectElements.length) {
    return { succeded: false, resultSvg: null };
  }

  const rectSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect",
  );

  if (rectElements.length > 0) {
    const x = rectElements.reduce((minXCoord, svgRect) => {
      const rectX = svgRect.x.baseVal.value;
      return rectX < minXCoord ? rectX : minXCoord;
    }, rectElements[0].x.baseVal.value);
    rectSvg.setAttribute("x", x.toString());

    const y = rectElements.reduce((minYCoord, svgRect) => {
      const rectY = svgRect.y.baseVal.value;
      return rectY < minYCoord ? rectY : minYCoord;
    }, rectElements[0].y.baseVal.value);
    rectSvg.setAttribute("y", y.toString());

    const maxX = rectElements.reduce((maxXCoord, svgRect) => {
      const rectX = svgRect.x.baseVal.value + svgRect.width.baseVal.value;
      return rectX > maxXCoord ? rectX : maxXCoord;
    }, rectElements[0].x.baseVal.value + rectElements[0].width.baseVal.value);
    const width = maxX - x;
    rectSvg.setAttribute("width", width.toString());

    const maxY = rectElements.reduce((maxYCoord, svgRect) => {
      const rectY = svgRect.y.baseVal.value + svgRect.height.baseVal.value;
      return rectY > maxYCoord ? rectY : maxYCoord;
    }, rectElements[0].y.baseVal.value + rectElements[0].height.baseVal.value);
    const height = maxY - y;
    rectSvg.setAttribute("height", height.toString());

    rectSvg.setAttribute("fill", rectElements[0].getAttribute("fill")!);
    rectSvg.setAttribute("stroke", rectElements[0].getAttribute("stroke")!);
    rectSvg.setAttribute(
      "stroke-width",
      rectElements[0].getAttribute("stroke-width")!,
    );
  }

  return {
    succeded: true,
    resultSvg: rectSvg,
  };
};

const getDimensionsFromPaths = (groupSvg: SVGGElement) => {
  let pathRectElements: SVGPathElement[] = Array.from(
    groupSvg.querySelectorAll("path"),
  );

  const rectPathPattern =
    /^M\s*(-?\d+(\.\d+)?)[,\s](-?\d+(\.\d+)?)\s+L\s+(-?\d+(\.\d+)?)[,\s](-?\d+(\.\d+)?)\s+L\s+(-?\d+(\.\d+)?)[,\s](-?\d+(\.\d+)?)\s+L\s+(-?\d+(\.\d+)?)[,\s](-?\d+(\.\d+)?)\s+Z$/;
  pathRectElements = pathRectElements
    .filter((p) => p.hasAttribute("d"))
    .filter((p) => rectPathPattern.test(p.getAttribute("d")!));

  if (groupSvg.children.length !== pathRectElements.length) {
    return { succeded: false, resultSvg: null };
  }

  const rectSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect",
  );

  if (pathRectElements.length > 0) {
    const x = pathRectElements.reduce((minXCoord, svgPath) => {
      const xCoordinates: number[] =
        svgPath
          .getAttribute("d")!
          .toString()
          .match(/(\d+(\.\d+)?)\s+/g)
          ?.map((coord) => parseFloat(coord.trim())) || [];

      const minRectX: number | undefined = Math.min(...xCoordinates);

      if (minRectX !== undefined) {
        return minRectX < minXCoord ? minRectX : minXCoord;
      }

      return minXCoord;
    }, 0);
    rectSvg.setAttribute("x", x.toString());

    const y = pathRectElements.reduce((minYCoord, svgPath) => {
      const yCoordinates: number[] =
        svgPath
          .getAttribute("d")!
          .toString()
          .match(/(\d+(\.\d+)?)\s+(\d+(\.\d+)?)\s+/g)
          ?.map((coord) => parseFloat(coord.trim().split(/\s+/)[1])) || [];

      const minRectY: number | undefined = Math.min(...yCoordinates);

      if (minRectY !== undefined) {
        return minRectY < minYCoord ? minRectY : minYCoord;
      }

      return minYCoord;
    }, 0);
    rectSvg.setAttribute("y", y.toString());

    const maxX = pathRectElements.reduce((maxXCoord, svgPath) => {
      const xCoordinates: number[] =
        svgPath
          .getAttribute("d")!
          .toString()
          .match(/(\d+(\.\d+)?)\s+/g)
          ?.map((coord) => parseFloat(coord.trim())) || [];

      const maxRectX: number | undefined = Math.max(...xCoordinates);

      if (maxRectX !== undefined) {
        return maxRectX > maxXCoord ? maxRectX : maxXCoord;
      }

      return maxXCoord;
    }, 0);
    rectSvg.setAttribute("width", (maxX - x).toString());

    const maxY = pathRectElements.reduce((maxYCoord, svgPath) => {
      const yCoordinates: number[] =
        svgPath
          .getAttribute("d")!
          .toString()
          .match(/(\d+(\.\d+)?)\s+(\d+(\.\d+)?)\s+/g)
          ?.map((coord) => parseFloat(coord.trim().split(/\s+/)[1])) || [];

      const maxRectY: number | undefined = Math.max(...yCoordinates);

      if (maxRectY !== undefined) {
        return maxRectY > maxYCoord ? maxRectY : maxYCoord;
      }

      return maxYCoord;
    }, 0);
    rectSvg.setAttribute("height", (maxY - y).toString());

    rectSvg.setAttribute("fill", pathRectElements[0].getAttribute("fill")!);
    rectSvg.setAttribute("stroke", pathRectElements[0].getAttribute("stroke")!);
    rectSvg.setAttribute(
      "stroke-width",
      pathRectElements[0].getAttribute("stroke-width")!,
    );
  }

  return {
    succeded: true,
    resultSvg: rectSvg,
  };
};
