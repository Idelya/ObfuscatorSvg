export const revertMosaic = (groupSvg: SVGGElement) => {
  revertMosaicFromOriginal(groupSvg);
  revertMosaicFromPaths(groupSvg);
};

const revertMosaicFromOriginal = (groupSvg: SVGGElement) => {
  const circles = groupSvg.getElementsByTagName("circle");

  for (let i = circles.length - 1; i >= 0; i--) {
    const circle = circles[i];

    const cx = parseFloat(circle.getAttribute("cx") || "0");
    const cy = parseFloat(circle.getAttribute("cy") || "0");
    const r = parseFloat(circle.getAttribute("r") || "0");
    const fill = circle.getAttribute("fill")!;
    const strokeWidth = circle.getAttribute("stroke-width")!;

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", (cx - r).toString());
    rect.setAttribute("y", (cy - r).toString());
    rect.setAttribute("width", (2 * r).toString());
    rect.setAttribute("height", (2 * r).toString());
    rect.setAttribute("fill", fill);
    rect.setAttribute("stroke", fill);
    rect.setAttribute("stroke-width", strokeWidth);

    groupSvg.replaceChild(rect, circle);

    const polygons = groupSvg.getElementsByTagName("polygon");

    for (let j = polygons.length - 1; j >= 0; j--) {
      const points = polygons[j]
        .getAttribute("points")!
        .split(" ")
        .map((pair) => {
          return pair.split(",").map((elem) => parseFloat(elem));
        });
      if (isPolygonIntersectingRect(points, rect)) {
        groupSvg.removeChild(polygons[j]);
      }
    }
  }
};

const isPolygonIntersectingRect = (
  points: number[][],
  rect: SVGRectElement,
) => {
  const rectX = parseFloat(rect.getAttribute("x") || "0");
  const rectY = parseFloat(rect.getAttribute("y") || "0");
  const rectWidth = parseFloat(rect.getAttribute("width") || "0");
  const rectHeight = parseFloat(rect.getAttribute("height") || "0");

  // Sprawdzenie przecięcia
  for (const [x, y] of points) {
    if (
      x >= rectX &&
      x <= rectX + rectWidth &&
      y >= rectY &&
      y <= rectY + rectHeight
    ) {
      return true;
    }
  }

  return false;
};

const revertMosaicFromPaths = (groupSvg: SVGGElement) => {
  const circlePathPattern =
    /^M\s*\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?\s+A\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?\s+\d+(\.\d+)?\s*Z$/;

  const allPaths = groupSvg.getElementsByTagName("path");
  const circles = Array.from(allPaths).filter((p) =>
    circlePathPattern.test(p.getAttribute("d")!),
  );

  if (circles.length == allPaths.length) {
    // not rect
    return;
  }

  for (let i = circles.length - 1; i >= 0; i--) {
    const circle = circles[i];

    const d = circle.getAttribute("d")!;
    const coords = d
      .replace("M", "")
      .replace("A", "")
      .replace("Z", "")
      .split(" ")
      .map(parseFloat);

    console.log(coords);

    const cx = coords[0];
    const cy = coords[1];
    const r = coords[4];
    const fill = circle.getAttribute("fill")!;
    const strokeWidth = circle.getAttribute("stroke-width")!;
    const x = cx - r;
    const y = cy - r;
    const side = 2 * r;

    const rectPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );

    rectPath.setAttribute(
      "d",
      `M ${x} ${y} L ${x + side} ${y} L ${x + side} ${y + side} L ${x} ${
        y + side
      } Z`,
    );

    rectPath.setAttribute("fill", fill);
    rectPath.setAttribute("stroke", fill);
    rectPath.setAttribute("stroke-width", strokeWidth);

    groupSvg.replaceChild(rectPath, circle);

    const polygonPathPattern =
      /^M\s*-?\d+(\.\d+)?,-?\d+(\.\d+)?\s+-?\d+(\.\d+)?,-?\d+(\.\d+)?\s+-?\d+(\.\d+)?,-?\d+(\.\d+)?\s*Z$/;

    const polygons = Array.from(allPaths).filter((p) =>
      polygonPathPattern.test(p.getAttribute("d")!),
    );

    for (let j = polygons.length - 1; j >= 0; j--) {
      const points = polygons[j]
        .getAttribute("d")!
        .replace("M", "")
        .replace("Z", "")
        .split(" ")
        .map((pair) => {
          return pair.split(",").map((elem) => parseFloat(elem));
        });

      if (isPolygonIntersectingRectPath(points, x, y, side)) {
        groupSvg.removeChild(polygons[j]);
      }
    }
  }
};

const isPolygonIntersectingRectPath = (
  points: number[][],
  rectX: number,
  rectY: number,
  side: number,
) => {
  for (const [x, y] of points) {
    if (x >= rectX && x <= rectX + side && y >= rectY && y <= rectY + side) {
      return true;
    }
  }

  return false;
};
