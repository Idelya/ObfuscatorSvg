import { FormSchemaSvgGenerator, propsByShape } from "../constant";

export const generateSvg = (formInputs: FormSchemaSvgGenerator): string => {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.setAttribute("height", "300");
  svg.setAttribute("width", "300");

  const shape = document.createElementNS(
    "http://www.w3.org/2000/svg",
    formInputs.shape,
  );

  propsByShape[formInputs.shape as keyof typeof propsByShape].size.forEach(
    (attr) => {
      shape.setAttribute(attr, formInputs.size.toString());
    },
  );
  shape.setAttribute("fill", formInputs.shapeColor);
  shape.setAttribute("stroke", formInputs.shapeColor);
  shape.setAttribute("stroke-width", "1");
  svg.appendChild(shape);
  const svgAsStr = new XMLSerializer().serializeToString(svg);
  return svgAsStr;
};
