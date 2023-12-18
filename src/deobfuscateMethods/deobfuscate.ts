import { DeobfuscateParams } from "./deobfuscateParams";
import { tryConcatenateRect } from "./rectDeobfuscation";

export const deobfuscate = (svgElement: string, params: DeobfuscateParams) => {
  const resultSvg = new DOMParser().parseFromString(svgElement, "image/svg+xml")
    .documentElement as unknown as SVGElement;

  resultSvg.childNodes.forEach((node) => {
    const group = node as SVGGElement;
    if (params.removeUnnecessaryElements) {
      removeUnnecessaryElements(group);
    }
    if (params.removeUnnecessaryAttributes) {
      removeUnnecessaryAttributes(group);
    }
    if (params.removeStyles) {
      removeStyles(group);
    }

    const rectCombination = tryConcatenateRect(group);
    if (rectCombination.succeded) {
      group.outerHTML = rectCombination.resultSvg!.outerHTML;
    } else {
      // TODO: same for circle and polygon
    }
  });

  const svgAsStr = new XMLSerializer().serializeToString(resultSvg);
  return svgAsStr;
};

const removeUnnecessaryAttributes = (svg: SVGElement) => {
  if (svg && svg.tagName !== "style") {
    if (svg.tagName === "rect") {
      svg.removeAttribute("widht");
      svg.removeAttribute("heigth");
    } else {
      svg.removeAttribute("width");
      svg.removeAttribute("height");
    }
    if (svg.hasChildNodes()) {
      svg.childNodes.forEach((node) =>
        removeUnnecessaryAttributes(node as SVGElement),
      );
    }
  }
};

const removeStyles = (svg: SVGElement) => {
  if (svg) {
    for (let i = 0; i < svg.childNodes.length; i++) {
      const elem = svg.childNodes[i] as SVGElement;
      if (!elem) {
        continue;
      }

      if (elem.tagName === "style") {
        svg.removeChild(svg.childNodes[i]);
        i--;
      } else {
        removeStyles(elem);
      }
    }
  }
};

const removeUnnecessaryElements = (groupSvg: SVGGElement) => {
  const hiddenElements: ChildNode[] = [];
  for (let i = 0; i < groupSvg.childNodes.length; i++) {
    const elem = groupSvg.childNodes[i] as SVGElement;
    if (!elem) {
      continue;
    }

    if (
      (elem.hasAttribute("opacity") && elem.getAttribute("opacity") === "0") ||
      elem.classList.contains("red") ||
      (elem.hasAttribute("fill") &&
        elem.getAttribute("fill")?.length === 9 &&
        elem.getAttribute("fill")?.endsWith("00"))
    ) {
      hiddenElements.push(groupSvg.childNodes[i]);
    }
  }

  hiddenElements.forEach((e) => groupSvg.removeChild(e));
  return groupSvg;
};
