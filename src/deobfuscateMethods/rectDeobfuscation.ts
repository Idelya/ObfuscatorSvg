import { ConcatenationResult } from "./concatenationResult";

interface RectDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const tryConcatenateRect = (groupSvg: SVGGElement) => {
  const rectsConcatenationResult = getDimensionsFromRects(groupSvg);
  if (rectsConcatenationResult.succeded) {
    return rectsConcatenationResult;
  }
  //const pathDimensions = getDimensionsFromPaths(groupSvg);

  const result: ConcatenationResult = {
    resultSvg: null,
    succeded: false,
  };

  return result;
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
  }

  return {
    succeded: true,
    resultSvg: rectSvg,
  };
};

const getDimensionsFromPaths = (groupSvg: SVGGElement) => {
  const pathRectElements: SVGPathElement[] = Array.from(
    groupSvg.querySelectorAll("path"),
  );

  const dimensions: RectDimensions = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  };

  if (pathRectElements.length > 0) {
    dimensions.x = pathRectElements.reduce((minXCoord, svgPath) => {
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
    }, dimensions.x);

    dimensions.y = pathRectElements.reduce((minYCoord, svgPath) => {
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
    }, dimensions.y);

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
    }, dimensions.width);
    dimensions.width = maxX - dimensions.x;

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
    }, dimensions.height);
    dimensions.height = maxY - dimensions.y;
  }

  return dimensions;
};
