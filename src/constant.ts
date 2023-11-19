export const shapes = ["circle", "rect", "polygon"];

export type FormSchemaSvgGenerator = {
  shape: (typeof shapes)[number];
  shapeColor: string;
  size: number;
  backgroundColor: string;
};

export const propsByShape = {
  circle: {
    size: ["r", "cx", "cy"],
    points: null,
  },
  rect: {
    size: ["width", "height"],
    points: null,
  },
  polygon: {
    size: ["width", "height"],
    points: (size: number) => `${size / 2},0 0,${size} ${size},${size}`,
  },
};

export const initElement = {
  shape: "circle",
  shapeColor: "#000",
  size: 20,
  backgroundColor: "#fff",
};

export const svgGeneratorInit: { elements: FormSchemaSvgGenerator[] } = {
  elements: [
    {
      ...initElement,
    },
  ],
};

export type ObfuscationParametrs = {
  rectDivisionDepth: number;
  circleDivision: number;
  polygonDivisionDepth: number;
};
