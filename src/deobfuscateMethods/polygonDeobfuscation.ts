import { ConcatenationResult } from "./concatenationResult";

export const tryConcatenatePolygon = (groupSvg: SVGGElement) => {
  const polygonsConcatenationResult: ConcatenationResult =
    getSvgFromPolygons(groupSvg);
  if (polygonsConcatenationResult.succeded) {
    return polygonsConcatenationResult;
  }
  //   const pathsConcatenationResult: ConcatenationResult =
  //     getSvgFromPaths(groupSvg);
  //   return pathsConcatenationResult;
  const result: ConcatenationResult = { succeded: false, resultSvg: null };
  return result;
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
        [index]!.split(",");
      const pointX = parseFloat(points[0]);
      const pointY = parseFloat(points[1]);
      return { x: pointX, y: pointY };
    };

    const topCoordinates = polygonElements.reduce(
      (topCoords, svgPolygon) => {
        const elementCoords = getCoordinatesFromPolygon(svgPolygon, 0);
        if (elementCoords.y < topCoords.y) {
          return elementCoords;
        }
        return topCoords;
      },
      getCoordinatesFromPolygon(polygonElements[0], 0),
    );

    const leftCoordinates = polygonElements.reduce(
      (topCoords, svgPolygon) => {
        const elementCoords = getCoordinatesFromPolygon(svgPolygon, 1);
        if (elementCoords.x < topCoords.x) {
          return elementCoords;
        }
        return topCoords;
      },
      getCoordinatesFromPolygon(polygonElements[0], 1),
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
