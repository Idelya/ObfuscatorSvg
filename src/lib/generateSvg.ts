import { FormSchemaSvgGenerator, propsByShape } from "../constant";

export const generateSvg = (formInputs: {
  elements: FormSchemaSvgGenerator[];
}): string => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.setAttribute("height", "300");
  svg.setAttribute("width", "300");

  formInputs.elements.forEach((element) => {
    const shape = document.createElementNS(
      "http://www.w3.org/2000/svg",
      element.shape,
    );

    propsByShape[element.shape as keyof typeof propsByShape].size.forEach(
      (attr) => {
        shape.setAttribute(attr, element.size.toString());
      },
    );

    const generatePoints =
      propsByShape[element.shape as keyof typeof propsByShape].points;
    if (generatePoints) {
      shape.setAttribute("points", generatePoints(element.size));
    }

    shape.setAttribute("fill", element.shapeColor);
    shape.setAttribute("stroke", element.shapeColor);
    shape.setAttribute("stroke-width", "1");
    svg.appendChild(shape);
  });

  const svgAsStr = new XMLSerializer().serializeToString(svg);
  return svgAsStr;
};
