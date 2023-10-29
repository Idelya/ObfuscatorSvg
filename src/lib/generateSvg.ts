import { FormSchemaSvgGenerator, propsByShape } from "../constant";

export const generateSvg = (formInputs: FormSchemaSvgGenerator): SVGElement => {
  console.log(formInputs);
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
  svg.appendChild(shape);

  return svg;
};