export const styleTransform = (svgElement: SVGElement) => {
  svgElement.childNodes.forEach((element) => {
    const randomNumber = Math.floor(Math.random() * 45);

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

function rotatePoint([x, y]: [number, number], angle: number) {
  const radians = (angle * Math.PI) / 180;
  const newX = x * Math.cos(radians) - y * Math.sin(radians);
  const newY = x * Math.sin(radians) + y * Math.cos(radians);
  return [newX, newY];
}
