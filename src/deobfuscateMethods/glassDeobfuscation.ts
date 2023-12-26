export const revertGlass = (groupSvg: SVGGElement) => {
  revertGlassFromPolygons(groupSvg);
  // TODO: Try revertGlassFromPaths
};

const revertGlassFromPolygons = (groupSvg: SVGGElement) => {
  const polygonElements: SVGPolygonElement[] = Array.from(
    groupSvg.querySelectorAll("polygon"),
  );

  const pointPolygonMapping = getPointPolygonMapping(polygonElements);

  const rectGlassPolygons = Object.entries(pointPolygonMapping)
    .map(([_, polygons]) => polygons)
    .filter(isRectGlass);

  rectGlassPolygons.forEach((polygons) =>
    replacePolygonsWithRect(polygons, groupSvg),
  );
};

const replacePolygonsWithRect = (
  polygons: SVGPolygonElement[],
  groupSvg: SVGGElement,
) => {
  polygons.forEach((polygon) => {
    groupSvg.removeChild(polygon);
  });

  const rectSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect",
  );

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

  const topLeftCoordinates = polygons.reduce(
    (accumulator, svgPolygon) => {
      let minCoords = accumulator;
      const elementCoords0 = getCoordinatesFromPolygon(svgPolygon, 0);
      if (elementCoords0.x <= minCoords.x && elementCoords0.y <= minCoords.y) {
        minCoords = elementCoords0;
      }

      const elementCoords1 = getCoordinatesFromPolygon(svgPolygon, 1);
      if (elementCoords1.x <= minCoords.x && elementCoords1.y <= minCoords.y) {
        minCoords = elementCoords1;
      }

      const elementCoords2 = getCoordinatesFromPolygon(svgPolygon, 2);
      if (elementCoords2.x <= minCoords.x && elementCoords2.y <= minCoords.y) {
        minCoords = elementCoords2;
      }

      return minCoords;
    },
    getCoordinatesFromPolygon(polygons[0], 0),
  );
  rectSvg.setAttribute("x", topLeftCoordinates.x.toString());
  rectSvg.setAttribute("y", topLeftCoordinates.y.toString());

  const downRightCoordinates = polygons.reduce(
    (accumulator, svgPolygon) => {
      let minCoords = accumulator;
      const elementCoords0 = getCoordinatesFromPolygon(svgPolygon, 0);
      if (elementCoords0.x >= minCoords.x && elementCoords0.y >= minCoords.y) {
        minCoords = elementCoords0;
      }

      const elementCoords1 = getCoordinatesFromPolygon(svgPolygon, 1);
      if (elementCoords1.x >= minCoords.x && elementCoords1.y >= minCoords.y) {
        minCoords = elementCoords1;
      }

      const elementCoords2 = getCoordinatesFromPolygon(svgPolygon, 2);
      if (elementCoords2.x >= minCoords.x && elementCoords2.y >= minCoords.y) {
        minCoords = elementCoords2;
      }

      return minCoords;
    },
    getCoordinatesFromPolygon(polygons[0], 0),
  );
  const width = downRightCoordinates.x - topLeftCoordinates.x;
  const height = downRightCoordinates.y - topLeftCoordinates.y;
  rectSvg.setAttribute("width", width.toString());
  rectSvg.setAttribute("height", height.toString());

  rectSvg.setAttribute("fill", polygons[0].getAttribute("fill")!);
  rectSvg.setAttribute("stroke", polygons[0].getAttribute("stroke")!);
  rectSvg.setAttribute(
    "stroke-width",
    polygons[0].getAttribute("stroke-width")!,
  );

  groupSvg.appendChild(rectSvg);
};

const isRectGlass = (polygons: SVGPolygonElement[]) => {
  if (polygons.length !== 4) {
    return false;
  }

  const innerPointPolygonMapping: { [key: string]: number } = {};
  for (let i = 0; i < polygons.length; i++) {
    const polygonPoints = getPointsFromPolygon(polygons[i]);
    polygonPoints.forEach((p) => {
      if (!(p in innerPointPolygonMapping)) {
        innerPointPolygonMapping[p] = 0;
      }
      innerPointPolygonMapping[p] = innerPointPolygonMapping[p] + 1;
    });
  }

  const areOddsPoints =
    Object.entries(innerPointPolygonMapping).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, count]) => count % 2 !== 0,
    ).length > 0;
  if (areOddsPoints) {
    return false;
  }
  return true;
};

const getPointPolygonMapping = (polygonElements: SVGPolygonElement[]) => {
  const pointPolygonMapping: { [key: string]: SVGPolygonElement[] } = {};

  for (let i = 0; i < polygonElements.length; i++) {
    const points = getPointsFromPolygon(polygonElements[i]);
    points.forEach((p) => {
      if (!(p in pointPolygonMapping)) {
        pointPolygonMapping[p] = [];
      }
      pointPolygonMapping[p].push(polygonElements[i]);
    });
  }

  return pointPolygonMapping;
};

const getPointsFromPolygon = (svgPolygon: SVGPolygonElement) => {
  return svgPolygon.getAttribute("points")!.split(" ");
};
