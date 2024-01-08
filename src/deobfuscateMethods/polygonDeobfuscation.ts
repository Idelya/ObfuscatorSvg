import { ConcatenationResult } from "./concatenationResult";

export const tryConcatenatePolygon = (groupSvg: SVGGElement) => {
  const polygonsConcatenationResult: ConcatenationResult =
    getSvgFromPolygons(groupSvg);
  if (polygonsConcatenationResult.succeded) {
    return polygonsConcatenationResult;
  }
  const pathsConcatenationResult: ConcatenationResult =
    getSvgFromPaths(groupSvg);
  return pathsConcatenationResult;
};

const getSvgFromPolygons = (groupSvg: SVGGElement) => {
  const polygonElements: SVGPolygonElement[] = Array.from(
    groupSvg.querySelectorAll("polygon"),
  );

  if (groupSvg.children.length !== polygonElements.length) {
    return { succeded: false, resultSvg: null };
  }

  const polygonSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon",
  );

  if (polygonElements.length > 0) {
    const getCoordinatesFromPolygon = (
      svgPolygon: SVGPolygonElement,
      index: number,
    ) => {
      const points = svgPolygon
        .getAttribute("points")!
        .split(" ")
        .map(convertToPoint)
        .sort((a, b) => a[0] - b[0])[index];
      const pointX = points[0];
      const pointY = points[1];
      return { x: pointX, y: pointY };
    };

    const topCoordinates = polygonElements.reduce(
      (topCoords, svgPolygon) => {
        const elementCoords = getCoordinatesFromPolygon(svgPolygon, 1);
        if (elementCoords.y < topCoords.y) {
          return elementCoords;
        }
        return topCoords;
      },
      getCoordinatesFromPolygon(polygonElements[0], 1),
    );

    const leftCoordinates = polygonElements.reduce(
      (topCoords, svgPolygon) => {
        const elementCoords = getCoordinatesFromPolygon(svgPolygon, 0);
        if (elementCoords.x < topCoords.x) {
          return elementCoords;
        }
        return topCoords;
      },
      getCoordinatesFromPolygon(polygonElements[0], 0),
    );

    const rightCoordinates = polygonElements.reduce(
      (topCoords, svgPolygon) => {
        const elementCoords = getCoordinatesFromPolygon(svgPolygon, 2);
        if (elementCoords.x > topCoords.x) {
          return elementCoords;
        }
        return topCoords;
      },
      getCoordinatesFromPolygon(polygonElements[0], 2),
    );

    polygonSvg.setAttribute(
      "points",
      `${topCoordinates.x},${topCoordinates.y} ${leftCoordinates.x},${leftCoordinates.y} ${rightCoordinates.x},${rightCoordinates.y}`,
    );

    polygonSvg.setAttribute("fill", polygonElements[0].getAttribute("fill")!);
    polygonSvg.setAttribute(
      "stroke",
      polygonElements[0].getAttribute("stroke")!,
    );
    polygonSvg.setAttribute(
      "stroke-width",
      polygonElements[0].getAttribute("stroke-width")!,
    );
  }

  return {
    succeded: true,
    resultSvg: polygonSvg,
  };
};

const getSvgFromPaths = (groupSvg: SVGGElement) => {
  let pathElements: SVGPathElement[] = Array.from(
    groupSvg.querySelectorAll("path"),
  );

  const polygonPathPattern =
    /^M(\s)?(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)\s(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)\s(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)\sZ$/;
  pathElements = pathElements
    .filter((p) => p.hasAttribute("d"))
    .filter((p) => polygonPathPattern.test(p.getAttribute("d")!));

  if (groupSvg.children.length !== pathElements.length) {
    return { succeded: false, resultSvg: null };
  }

  const polygonSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon",
  );

  if (pathElements.length > 0) {
    const getCoordinatesFromPolygon = (
      svgPolygon: SVGPathElement,
      index: number,
    ) => {
      const points = svgPolygon
        .getAttribute("d")!
        .split(" ")
        .map((v) => v.replace("M", "").replace("Z", ""))
        .filter((str) => str && str.length > 0)
        .map(convertToPoint)
        .sort((a, b) => a[0] - b[0])[index];
      const pointX = points[0];
      const pointY = points[1];
      return { x: pointX, y: pointY };
    };

    const topCoordinates = pathElements.reduce(
      (topCoords, svgPolygon) => {
        const elementCoords = getCoordinatesFromPolygon(svgPolygon, 1);
        if (elementCoords.y < topCoords.y) {
          return elementCoords;
        }
        return topCoords;
      },
      getCoordinatesFromPolygon(pathElements[0], 1),
    );

    const leftCoordinates = pathElements.reduce(
      (topCoords, svgPolygon) => {
        const elementCoords = getCoordinatesFromPolygon(svgPolygon, 0);
        if (elementCoords.x < topCoords.x) {
          return elementCoords;
        }
        return topCoords;
      },
      getCoordinatesFromPolygon(pathElements[0], 0),
    );

    const rightCoordinates = pathElements.reduce(
      (topCoords, svgPolygon) => {
        const elementCoords = getCoordinatesFromPolygon(svgPolygon, 2);
        if (elementCoords.x > topCoords.x) {
          return elementCoords;
        }
        return topCoords;
      },
      getCoordinatesFromPolygon(pathElements[0], 2),
    );

    polygonSvg.setAttribute(
      "points",
      `${topCoordinates.x},${topCoordinates.y} ${leftCoordinates.x},${leftCoordinates.y} ${rightCoordinates.x},${rightCoordinates.y}`,
    );

    polygonSvg.setAttribute("fill", pathElements[0].getAttribute("fill")!);
    polygonSvg.setAttribute("stroke", pathElements[0].getAttribute("stroke")!);
    polygonSvg.setAttribute(
      "stroke-width",
      pathElements[0].getAttribute("stroke-width")!,
    );
  }

  return {
    succeded: true,
    resultSvg: polygonSvg,
  };
};

const convertToPoint = (pointStr: string): number[] => {
  const [x, y] = pointStr.split(",").map(Number);
  return [x, y];
};
