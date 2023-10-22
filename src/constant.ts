export const shapes = ["circle", "rect"];

export type FormSchemaSvgGenerator = {
  shape: (typeof shapes)[number];
  shapeColor: string;
  size: number;
  backgroundColor: string;
};

export const propsByShape = {
  circle: {
    size: ["r", "cx", "cy"],
  },
  rect: {
    size: ["width", "height"],
  },
};

export const svgGeneratorInit: FormSchemaSvgGenerator = {
  shape: "circle",
  shapeColor: "#000",
  size: 20,
  backgroundColor: "#fff",
};
