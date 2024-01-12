export const revertMosaic = (groupSvg: SVGGElement) => {
  revertMosaicFromOriginal(groupSvg);
  //revertMosaicFromPaths(groupSvg);
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

  // z każdego kwadratu usuń wszystkie trójkąty które są w nim
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
