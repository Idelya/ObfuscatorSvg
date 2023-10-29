type ObfuscationMethod = (svg: SVGElement) => SVGElement;

type obfuscatiorMethodNames = (keyof typeof obfuscationMethods)[];

export const obfuscate = (
  svgElement: string,
  methods: obfuscatiorMethodNames,
) => {
  let resultSvg = new DOMParser().parseFromString(svgElement, "image/svg+xml")
    .documentElement as unknown as SVGElement;

  methods.forEach((method) => {
    resultSvg = obfuscationMethods[method](resultSvg);
  });

  const svgAsStr = new XMLSerializer().serializeToString(resultSvg);
  return svgAsStr;
};

//TODO: Add methods
export const obfuscationMethods: { [key: string]: ObfuscationMethod } = {
  "method 1": (svg: SVGElement) => {
    svg.setAttribute("method", "method 1");
    return svg;
  },
  "method 2": (svg: SVGElement) => {
    svg.setAttribute("method", "method 2");
    return svg;
  },
};
