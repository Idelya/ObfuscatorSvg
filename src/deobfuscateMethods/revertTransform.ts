import {
  rotatePathCircle,
  rotatePathPolygon,
  rotatePathRect,
} from "../obfuscationMethods/obfuscationByStyle";

export const revertTransform = (groupSvg: SVGGElement) => {
  const clessesToDelete = [];
  groupSvg.childNodes.forEach((element) => {
    const elementSvg = element as SVGElement;
    if (!elementSvg.hasAttribute("d")) return;

    const rotationDegree = getRotationDegree(elementSvg as SVGElement);
    if (rotationDegree === null) return null;

    clessesToDelete.push(elementSvg.getAttribute("class"));
    elementSvg.removeAttribute("class");

    const commands = (elementSvg.getAttribute("d") || "").split(/\s+/);
    if (commands[0] === "M" && commands[3] === "A" && commands[11] === "Z") {
      rotatePathCircle(elementSvg, rotationDegree);
    } else if (
      commands[0] === "M" &&
      commands[2] === "L" &&
      commands[8] === "Z"
    ) {
      rotatePathRect(elementSvg, rotationDegree);
    } else if (commands[0] === "M" && commands[4] === "Z") {
      rotatePathPolygon(elementSvg, rotationDegree);
    }
  });
};

function getRotationDegreeByClass(className: string) {
  for (const styleSheet of document.styleSheets) {
    for (const rule of styleSheet.cssRules) {
      if (rule instanceof CSSStyleRule) {
        if (rule.selectorText === `.${className}`) {
          const rotateValue = rule.style.transform.match(/rotate\((.*?)\)/);
          if (rotateValue && rotateValue[1]) {
            return parseFloat(rotateValue[1]);
          }
        }
      }
    }
  }

  return null;
}

function getRotationDegree(svgElement: SVGElement) {
  const classAttribute = svgElement.getAttribute("class");
  if (!classAttribute) return null;
  return getRotationDegreeByClass(classAttribute);
}
