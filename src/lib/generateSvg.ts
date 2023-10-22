import { FormSchemaSvgGenerator } from '../constant';

export const generateSvg = (formInputs: FormSchemaSvgGenerator): SVGElement => {
  console.log(formInputs);
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

  svg.setAttribute('height', '300');
  svg.setAttribute('width', '300');

  const shape = document.createElementNS('http://www.w3.org/2000/svg', formInputs.shape);
  shape.setAttribute('cx', '20');
  shape.setAttribute('cy', '20');
  shape.setAttribute('r', '20');
  svg.appendChild(shape);

  return svg;
};
