export const styleTransformPolygon = (svgElement: SVGElement) => {
  svgElement.childNodes.forEach((element) => {
    if ((element as SVGElement).hasAttribute("origin")) return;
    const randomNumber = Math.floor(Math.random() * 360);

    const styleElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "style",
    );

    styleElement.textContent = `
      .rot-${randomNumber} {
          transform: rotate(${randomNumber}deg);
      }
    `;

    svgElement.appendChild(styleElement);
    (element as SVGElement).classList.add(`rot-${randomNumber}`);
    rotatePath(element as SVGElement, randomNumber * -1);
  });
};

export const styleTransformRect = (svgElement: SVGElement) => {
  svgElement.childNodes.forEach((element) => {
    if ((element as SVGElement).hasAttribute("origin")) return;
    const randomNumber = Math.floor(Math.random() * 360);

    const styleElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "style",
    );

    styleElement.textContent = `
      .rot-${randomNumber} {
          transform: rotate(${randomNumber}deg);
      }
    `;

    svgElement.appendChild(styleElement);
    (element as SVGElement).classList.add(`rot-${randomNumber}`);
    rotatePathRect(element as SVGElement, randomNumber * -1);
  });
};

export const styleTransformCircle = (svgElement: SVGElement) => {
  svgElement.childNodes.forEach((element) => {
    if ((element as SVGElement).hasAttribute("origin")) return;
    const randomNumber = Math.floor(Math.random() * 360);

    const styleElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "style",
    );

    styleElement.textContent = `
      .rot-${randomNumber} {
          transform: rotate(${randomNumber}deg);
      }
    `;

    svgElement.appendChild(styleElement);
    (element as SVGElement).classList.add(`rot-${randomNumber}`);
    rotatePathCircle(element as SVGElement, randomNumber * -1);
  });
};

const rotatePathRect = (elem: SVGElement, angle: number) => {
  const pathData = elem.getAttribute("d");
  if (!pathData) return;

  const pathCommands = pathData.split(/([MLZ])/).filter(Boolean);
  for (let i = 0; i < pathCommands.length; i += 2) {
    const command = pathCommands[i];

    if (command === "M" || command === "L") {
      const points = pathCommands[i + 1].split(" ").filter((point) => !!point);

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

const rotatePath = (elem: SVGElement, angle: number) => {
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

const rotatePathCircle = (pathElement: SVGElement, angle: number) => {
  const pathData = pathElement.getAttribute("d");
  if (!pathData) return;
  const pathCommands = pathData.split(/([MAZ])/).filter(Boolean);

  for (let i = 0; i < pathCommands.length; i += 2) {
    const command = pathCommands[i];

    if (command === "M") {
      const points = pathCommands[i + 1].split(" ").filter((point) => !!point);

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
  return [newX, newY];
}
