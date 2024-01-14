import { ConcatenationResult } from "./concatenationResult";

export const tryConcatenateCircle = (groupSvg: SVGGElement) => {
  const pathsConcatenationResult: ConcatenationResult =
    getSvgFromPaths(groupSvg);
  return pathsConcatenationResult;
};

function extractTwoLastNumbers(inputString: string) {
  const pattern = /(-?[\d.]+)\s*[,\s]*(-?[\d.]+)\s?Z/;

  const match = inputString.match(pattern);

  if (match) {
    const lastNumber1 = parseFloat(parseFloat(match[1]).toFixed(2));
    const lastNumber2 = parseFloat(parseFloat(match[2]).toFixed(2));

    return [lastNumber1, lastNumber2];
  } else {
    return null;
  }
}

function extractThirdAndFourthNumbers(inputString: string) {
  const pattern =
    /M\s?(-?\d+(\.\d+)?)\s*[,\s]*(-?\d+(\.\d+)?)\s(-?\d+(\.\d+)?)\s*[,\s]*(-?\d+(\.\d+)?)/;

  const match = inputString.match(pattern);

  if (match) {
    const thirdNumber = parseFloat(parseFloat(match[5]).toFixed(2));
    const fourthNumber = parseFloat(parseFloat(match[7]).toFixed(2));

    return [thirdNumber, fourthNumber];
  } else {
    return null;
  }
}

function moveAttributes(
  sourceElement: SVGElement,
  destinationElement: SVGElement,
  excludeAttributes: string[],
) {
  const attributes = sourceElement.attributes;

  for (let i = 0; i < attributes.length; i++) {
    const attribute = attributes[i];
    if (!excludeAttributes.includes(attribute.name)) {
      destinationElement.setAttribute(attribute.name, attribute.value);
    }
  }
}

function replaceLastTwoNumbersWithXY(
  inputString: string,
  newX: number,
  newY: number,
) {
  const pattern = /(\d+(\.\d+)?)\s*[,\s]*(\d+(\.\d+)?)\s?Z$/;

  const replacedString = inputString.replace(pattern, `${newX} ${newY}Z`);

  return replacedString;
}

const getSvgFromPaths = (groupSvg: SVGGElement): ConcatenationResult => {
  const pathElements: SVGPathElement[] = Array.from(
    groupSvg.querySelectorAll("path"),
  );

  const pathCircleElements = pathElements
    .filter((p) => p.hasAttribute("d"))
    .filter((p) => p.getAttribute("d")!.includes("A"));

  if (groupSvg.children.length !== pathCircleElements.length) {
    return { succeded: false, resultSvg: null };
  }

  const circleSvg = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );

  if (pathCircleElements.length <= 0) {
    return { succeded: false, resultSvg: null };
  }

  const startElement = pathCircleElements[0].cloneNode(true) as SVGElement;
  pathCircleElements.shift();
  let nextOneFound = true;

  while (nextOneFound && pathCircleElements.length > 0) {
    const points = extractTwoLastNumbers(startElement.getAttribute("d") || "");

    if (!points) {
      nextOneFound = false;
      break;
    }

    const nextElementIndex = pathCircleElements.findIndex((element) => {
      const endPoints = extractThirdAndFourthNumbers(
        element.getAttribute("d") || "",
      );
      return (
        !!endPoints && endPoints[0] == points[0] && endPoints[1] === points[1]
      );
    });

    if (nextElementIndex < 0) {
      nextOneFound = false;
      break;
    }

    const nextElement = pathCircleElements[nextElementIndex];
    pathCircleElements.splice(nextElementIndex, 1);

    const nextPoints = extractTwoLastNumbers(
      nextElement.getAttribute("d") || "",
    );

    if (!nextPoints) {
      nextOneFound = false;
      break;
    }

    const newPath = replaceLastTwoNumbersWithXY(
      startElement.getAttribute("d") || "",
      nextPoints[0],
      nextPoints[1],
    );

    startElement.setAttribute("d", newPath);
  }

  if (pathCircleElements.length > 0) {
    return { succeded: false, resultSvg: null };
  }

  const arcEndPoints = extractTwoLastNumbers(
    startElement.getAttribute("d") || "",
  );
  const arcStartPoints = extractThirdAndFourthNumbers(
    startElement.getAttribute("d") || "",
  );

  if (
    !arcEndPoints ||
    !arcStartPoints ||
    arcEndPoints[0] !== arcStartPoints[0] ||
    arcEndPoints[1] !== arcStartPoints[1]
  ) {
    return { succeded: false, resultSvg: null };
  }

  const aPattern = /A\s?(\d+(\.\d+)?)\s*[,\s]*(\d+(\.\d+)?)/;

  const dAttr = startElement.getAttribute("d");
  if (!dAttr) return { succeded: false, resultSvg: null };
  const match = dAttr.match(aPattern);

  if (!match) return { succeded: false, resultSvg: null };

  const cx = parseFloat(match[1]);
  const cy = parseFloat(match[3]);

  circleSvg.setAttribute("cx", cx.toString());
  circleSvg.setAttribute("cy", cy.toString());
  circleSvg.setAttribute("r", cy.toString());

  moveAttributes(startElement, circleSvg, ["d", "opacity"]);

  return {
    succeded: true,
    resultSvg: circleSvg,
  };
};
