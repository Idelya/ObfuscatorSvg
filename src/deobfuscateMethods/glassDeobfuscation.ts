const TRESHOLD = 0.00000001;

export const revertGlass = (groupSvg: SVGGElement) => {
  revertGlassFromPolygons(groupSvg);
  revertGlassFromPaths(groupSvg);
  revertGlassFromCircle(groupSvg);
};

const revertGlassFromCircle = (groupSvg: SVGGElement) => {
  const pathElements: SVGPathElement[] = Array.from(
    groupSvg.querySelectorAll("path"),
  );

  const pathCircleElements = pathElements
    .filter((p) => p.hasAttribute("d"))
    .filter((p) => p.getAttribute("d")!.includes("A"));
  const mPattern = /M\s?(\d+(\.\d+)?)\s*[,\s]*(\d+(\.\d+)?)/;
  const aPattern = /A\s?(\d+(\.\d+)?)\s*[,\s]*(\d+(\.\d+)?)/;
  pathCircleElements.forEach((element) => {
    const dAttr = element.getAttribute("d");
    if (!dAttr) return;
    const match = dAttr.match(aPattern);

    if (!match) return;

    const cx = parseFloat(match[1]);
    const cy = parseFloat(match[3]);
    const replacedString = dAttr.replace(mPattern, `M ${cx} ${cy}`);
    element.setAttribute("d", replacedString);
  });
};

const revertGlassFromPolygons = (groupSvg: SVGGElement) => {
  const polygonElements: SVGPolygonElement[] = Array.from(
    groupSvg.querySelectorAll("polygon"),
  );

  const pointPolygonMapping = getPointPolygonMapping(polygonElements);

  const rectGlassPolygons = Object.entries(pointPolygonMapping)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, polygons]) => polygons)
    .filter(isRectGlass);

  rectGlassPolygons.forEach((polygons) =>
    replacePolygonsWithRect(polygons, groupSvg),
  );

  const polygonGlassPolygons = Object.entries(pointPolygonMapping)
    .filter(([startingPoint, polygons]) =>
      isPolygonGlass(startingPoint, polygons),
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, polygons]) => polygons);

  polygonGlassPolygons.forEach((polygons) =>
    replacePolygonsWithPolygon(polygons, groupSvg),
  );
};

const replacePolygonsWithPolygon = (
  polygons: SVGPolygonElement[],
  groupSvg: SVGGElement,
) => {
  polygons.forEach((polygon) => {
    groupSvg.removeChild(polygon);
  });

  const polygonSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polygon",
  );

  const polygonPoints = Object.entries(getPointPolygonMapping(polygons))
    .filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, polygons]) => polygons.length === 2,
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([point, _]) => point);

  polygonSvg.setAttribute("points", polygonPoints.join(" "));

  polygonSvg.setAttribute("fill", polygons[0].getAttribute("fill")!);
  polygonSvg.setAttribute("stroke", polygons[0].getAttribute("stroke")!);
  polygonSvg.setAttribute(
    "stroke-width",
    polygons[0].getAttribute("stroke-width")!,
  );

  groupSvg.appendChild(polygonSvg);
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

const isPolygonGlass = (
  startingPoint: string,
  polygons: SVGPolygonElement[],
) => {
  if (polygons.length !== 3) {
    return false;
  }

  const innerPointPolygonMapping: { [key: string]: number } = {};
  innerPointPolygonMapping[startingPoint] = 1;
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

const revertGlassFromPaths = (groupSvg: SVGGElement) => {
  let pathElements: SVGPathElement[] = Array.from(
    groupSvg.querySelectorAll("path"),
  );

  const polygonPathPattern =
    /^M\s*-?\d+(\.\d+)?,-?\d+(\.\d+)? -?\d+(\.\d+)?,-?\d+(\.\d+)? -?\d+(\.\d+)?,-?\d+(\.\d+)?\s*Z$/;
  pathElements = pathElements
    .filter((p) => p.hasAttribute("d"))
    .filter((p) => polygonPathPattern.test(p.getAttribute("d")!));

  const pointPathMapping = getPointPathMapping(pathElements);

  const rectGlassPaths = Object.entries(pointPathMapping)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, polygonPaths]) => polygonPaths)
    .filter(isRectPathGlass);

  rectGlassPaths.forEach((pathPolygons) =>
    replacePathsWithRect(pathPolygons, groupSvg),
  );

  const polygonGlassPaths = Object.entries(pointPathMapping)
    .filter(([startingPoint, polygons]) =>
      isPolygonPathGlass(startingPoint, polygons),
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, polygons]) => polygons);

  polygonGlassPaths.forEach((polygons) =>
    replacePathsWithPolygon(polygons, groupSvg),
  );
};

const replacePathsWithRect = (
  polygons: SVGPathElement[],
  groupSvg: SVGGElement,
) => {
  polygons.forEach((polygon) => {
    groupSvg.removeChild(polygon);
  });

  const pathSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );

  const getCoordinatesFromPathPolygon = (
    svgPolygon: SVGPathElement,
    index: number,
  ) => {
    const points = svgPolygon
      .getAttribute("d")!
      .replace("M", "")
      .split(" ")
      .filter((s) => s.length > 0)
      [index]!.split(",");
    const pointX = parseFloat(points[0]);
    const pointY = parseFloat(points[1]);
    return { x: pointX, y: pointY };
  };

  const topLeftCoordinates = polygons.reduce(
    (accumulator, svgPolygon) => {
      let minCoords = accumulator;
      const elementCoords0 = getCoordinatesFromPathPolygon(svgPolygon, 0);
      if (elementCoords0.x <= minCoords.x && elementCoords0.y <= minCoords.y) {
        minCoords = elementCoords0;
      }

      const elementCoords1 = getCoordinatesFromPathPolygon(svgPolygon, 1);
      if (elementCoords1.x <= minCoords.x && elementCoords1.y <= minCoords.y) {
        minCoords = elementCoords1;
      }

      const elementCoords2 = getCoordinatesFromPathPolygon(svgPolygon, 2);
      if (elementCoords2.x <= minCoords.x && elementCoords2.y <= minCoords.y) {
        minCoords = elementCoords2;
      }

      return minCoords;
    },
    getCoordinatesFromPathPolygon(polygons[0], 0),
  );

  const downRightCoordinates = polygons.reduce(
    (accumulator, svgPolygon) => {
      let minCoords = accumulator;
      const elementCoords0 = getCoordinatesFromPathPolygon(svgPolygon, 0);
      if (elementCoords0.x >= minCoords.x && elementCoords0.y >= minCoords.y) {
        minCoords = elementCoords0;
      }

      const elementCoords1 = getCoordinatesFromPathPolygon(svgPolygon, 1);
      if (elementCoords1.x >= minCoords.x && elementCoords1.y >= minCoords.y) {
        minCoords = elementCoords1;
      }

      const elementCoords2 = getCoordinatesFromPathPolygon(svgPolygon, 2);
      if (elementCoords2.x >= minCoords.x && elementCoords2.y >= minCoords.y) {
        minCoords = elementCoords2;
      }

      return minCoords;
    },
    getCoordinatesFromPathPolygon(polygons[0], 0),
  );
  const x = topLeftCoordinates.x;
  const y = topLeftCoordinates.y;

  const width = downRightCoordinates.x - topLeftCoordinates.x;
  const height = downRightCoordinates.y - topLeftCoordinates.y;
  pathSvg.setAttribute(
    "d",
    `M ${x} ${y} L ${x + width} ${y} L ${x + width} ${y + height} L ${x} ${
      y + height
    } Z`,
  );

  pathSvg.setAttribute("fill", polygons[0].getAttribute("fill")!);
  pathSvg.setAttribute("stroke", polygons[0].getAttribute("stroke")!);
  pathSvg.setAttribute(
    "stroke-width",
    polygons[0].getAttribute("stroke-width")!,
  );

  groupSvg.appendChild(pathSvg);
};

const replacePathsWithPolygon = (
  polygons: SVGPathElement[],
  groupSvg: SVGGElement,
) => {
  polygons.forEach((polygon) => {
    groupSvg.removeChild(polygon);
  });

  const pathSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path",
  );

  const points = Object.entries(getPointPathMapping(polygons))
    .filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, polygons]) => polygons.length === 2,
    )
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([point, _]) => point);

  pathSvg.setAttribute("d", `M${points[0]} ${points[1]} ${points[2]} Z`);

  pathSvg.setAttribute("fill", polygons[0].getAttribute("fill")!);
  pathSvg.setAttribute("stroke", polygons[0].getAttribute("stroke")!);
  pathSvg.setAttribute(
    "stroke-width",
    polygons[0].getAttribute("stroke-width")!,
  );

  groupSvg.appendChild(pathSvg);
};

const isRectPathGlass = (pathPolygons: SVGPathElement[]) => {
  if (pathPolygons.length !== 4) {
    return false;
  }

  const innerPointPathMapping: { [key: string]: number } = {};
  for (let i = 0; i < pathPolygons.length; i++) {
    const polygonPoints = getPointsFromPathPolygon(pathPolygons[i]);
    polygonPoints.forEach((p) => {
      const existings = Object.entries(innerPointPathMapping)
        .filter((key) => {
          const x = key[0].split(",")[0];
          const y = key[0].split(",")[1];
          const px = p.split(",")[0];
          const py = p.split(",")[1];
          return (
            Math.abs(parseFloat(x) - parseFloat(px)) < TRESHOLD &&
            Math.abs(parseFloat(y) - parseFloat(py)) < TRESHOLD
          );
        })
        .map((x) => x[0]);
      if (existings.length === 0) {
        existings.push(p);
        innerPointPathMapping[p] = 0;
      }

      innerPointPathMapping[existings[0]] =
        innerPointPathMapping[existings[0]] + 1;
    });
  }

  const areOddsPoints =
    Object.entries(innerPointPathMapping).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, count]) => count % 2 !== 0,
    ).length > 0;
  if (areOddsPoints) {
    return false;
  }
  return true;
};

const isPolygonPathGlass = (
  startingPoint: string,
  pathPolygons: SVGPathElement[],
) => {
  if (pathPolygons.length !== 3) {
    return false;
  }

  const innerPointPathMapping: { [key: string]: number } = {};
  innerPointPathMapping[startingPoint] = 1;
  for (let i = 0; i < pathPolygons.length; i++) {
    const polygonPoints = getPointsFromPathPolygon(pathPolygons[i]);
    polygonPoints.forEach((p) => {
      const existings = Object.entries(innerPointPathMapping)
        .filter((key) => {
          const x = key[0].split(",")[0];
          const y = key[0].split(",")[1];
          const px = p.split(",")[0];
          const py = p.split(",")[1];
          return (
            Math.abs(parseFloat(x) - parseFloat(px)) < TRESHOLD &&
            Math.abs(parseFloat(y) - parseFloat(py)) < TRESHOLD
          );
        })
        .map((x) => x[0]);
      if (existings.length === 0) {
        existings.push(p);
        innerPointPathMapping[p] = 0;
      }
      innerPointPathMapping[existings[0]] =
        innerPointPathMapping[existings[0]] + 1;
    });
  }
  const areOddsPoints =
    Object.entries(innerPointPathMapping).filter(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ([_, count]) => count % 2 !== 0,
    ).length > 0;
  if (areOddsPoints) {
    return false;
  }
  return true;
};

const getPointPathMapping = (pathPolygonElements: SVGPathElement[]) => {
  const pointPathMapping: { [key: string]: SVGPathElement[] } = {};

  for (let i = 0; i < pathPolygonElements.length; i++) {
    const points = getPointsFromPathPolygon(pathPolygonElements[i]);
    points.forEach((p) => {
      const existings = Object.entries(pointPathMapping)
        .filter((key) => {
          const x = key[0].split(",")[0];
          const y = key[0].split(",")[1];
          const px = p.split(",")[0];
          const py = p.split(",")[1];
          return (
            Math.abs(parseFloat(x) - parseFloat(px)) < TRESHOLD &&
            Math.abs(parseFloat(y) - parseFloat(py)) < TRESHOLD
          );
        })
        .map((x) => x[0]);
      if (existings.length === 0) {
        existings.push(p);
        pointPathMapping[p] = [];
      }
      pointPathMapping[existings[0]].push(pathPolygonElements[i]);
    });
  }

  return pointPathMapping;
};

const getPointsFromPathPolygon = (svgPolygon: SVGPathElement) => {
  return svgPolygon
    .getAttribute("d")!
    .replace("Z", "")
    .replace("M", "")
    .split(" ")
    .filter((str) => str.length > 0);
};
