import { generateRandomString } from "./utils";

export const styleTransform = (svgElement: SVGElement) => {
  svgElement.childNodes.forEach((element) => {
    const elementSvg = element as SVGElement;
    if (elementSvg.hasAttribute("origin") || !elementSvg.hasAttribute("d"))
      return;
    const randomNumber = Math.floor(Math.random() * 360);

    const styleElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "style",
    );

    const className = `${generateRandomString(
      5,
    )}${randomNumber}${generateRandomString(3)}`;

    styleElement.textContent = `
      .${className} {
          transform: rotate(${randomNumber}deg);
      }
    `;

    svgElement.appendChild(styleElement);
    elementSvg.classList.add(`${className}`);
    if (elementSvg.getAttribute("figure-type") === "polygon") {
      rotatePathPolygon(elementSvg, randomNumber * -1);
    } else if (elementSvg.getAttribute("figure-type") === "rect") {
      rotatePathRect(elementSvg, randomNumber * -1);
    } else if (elementSvg.getAttribute("figure-type") === "circle") {
      rotatePathCircle(elementSvg, randomNumber * -1);
    }
  });
};

export const rotatePathRect = (elem: SVGElement, angle: number) => {
  const pathData = elem.getAttribute("d");
  if (!pathData) return;

  const pathCommands = pathData.split(/([MLZ])/).filter(Boolean);
  for (let i = 0; i < pathCommands.length; i += 2) {
    const command = pathCommands[i];

    if (command === "M" || command === "L") {
      const points = pathCommands[i + 1]
        .split(/\s|,\s*/)
        .filter((point) => !!point);

      let coordinates = "";
      for (let j = 0; j < points.length; j += 2) {
        const [x, y] = [parseFloat(points[j]), parseFloat(points[j + 1])];
        const rotatedPoint = rotatePoint([x, y], angle);
        coordinates += rotatedPoint + " ";
      }

      pathCommands[i + 1] = coordinates;
    }
  }
  elem.setAttribute("d", pathCommands.join(" "));
};

export const rotatePathPolygon = (elem: SVGElement, angle: number) => {
  const pathData = elem.getAttribute("d");
  if (!pathData) return;

  const pathCommands = pathData.split(/([MZ])/).filter(Boolean);
  for (let i = 0; i < pathCommands.length; i += 2) {
    const command = pathCommands[i];

    if (command === "M") {
      const points = pathCommands[i + 1]
        .split(" ")
        .filter((point) => !!point)
        .map((point) => {
          const [x, y] = point.split(",").map(parseFloat);
          const rotatedPoint = rotatePoint([x, y], angle);
          return rotatedPoint.join(",");
        });
      pathCommands[i + 1] = points.join(" ");
    }
  }
  elem.setAttribute("d", pathCommands.join(" "));
};

export const rotatePathCircle = (pathElement: SVGElement, angle: number) => {
  const pathData = pathElement.getAttribute("d");
  if (!pathData) return;
  const pathCommands = pathData.split(/([MAZ])/).filter(Boolean);

  for (let i = 0; i < pathCommands.length; i += 2) {
    const command = pathCommands[i];

    if (command === "M") {
      const points = pathCommands[i + 1]
        .split(/\s|,\s*/)
        .filter((point) => !!point);

      let coordinates = "";
      for (let j = 0; j < points.length; j += 2) {
        const [x, y] = [parseFloat(points[j]), parseFloat(points[j + 1])];
        const rotatedPoint = rotatePoint([x, y], angle);
        coordinates += rotatedPoint + " ";
      }

      pathCommands[i + 1] = coordinates;
    } else if (command === "A") {
      const points = pathCommands[i + 1].split(" ").filter((point) => !!point);
      const rx = points[0];
      const ry = points[1];
      const [x, y] = [parseFloat(points[5]), parseFloat(points[6])];
      const rotatedPoint = rotatePoint([x, y], angle);

      pathCommands[
        i + 1
      ] = `${rx} ${ry} 0 0 1 ${rotatedPoint[0]} ${rotatedPoint[1]}`;
    }
  }
  pathElement.setAttribute("d", pathCommands.join(" "));
};

function rotatePoint([x, y]: [number, number], angle: number) {
  const radians = (angle * Math.PI) / 180;
  const newX = x * Math.cos(radians) - y * Math.sin(radians);
  const newY = x * Math.sin(radians) + y * Math.cos(radians);
  return [newX.toFixed(10), newY.toFixed(10)];
}
