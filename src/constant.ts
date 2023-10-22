export const shapes = ["circle", "rect"];

export type FormSchemaSvgGenerator = {
  shape: (typeof shapes)[number];
  shapeColor: string;
  backgroundColor: string;
};

export const svgGeneratorInit: FormSchemaSvgGenerator = {
  shape: "circle",
  shapeColor: "#000",
  backgroundColor: "#fff",
};
