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

export const obfuscationMethods: { [key: string]: ObfuscationMethod } = {
  "divide into parts": (svg: SVGElement) => {
    svg.childNodes.forEach((elem, _) => {
      const svgChild = elem as SVGElement;
      if (svgChild.tagName === "circle"){
        divideCircle(svgChild);
      }
      else if (svgChild.tagName === "rect"){
        divideRect(svgChild);
      }
      else if (svgChild.tagName === "polygon"){
        dividePolygon(svgChild);
      }
      else {
        throw elem;
      }
    });
    svg.setAttribute("method", "method 1");
    return svg;
  },
  "randomize": (svg: SVGElement) => {
    svg.setAttribute("method", "method 2");
    return svg;
  },
  "change specific elements into paths": (svg: SVGElement) => {
    svg.setAttribute("method", "method 3");
    return svg;
  },
};

const divideCircle = (circleSvg: SVGElement) => {
  const r = circleSvg.getAttribute("r");
  const cx = circleSvg.getAttribute("cx");
  const cy = circleSvg.getAttribute("cy");
  const fill = circleSvg.getAttribute("fill");

  console.log(r, cx, cy, fill);
}

const divideRect = (rectSvg: SVGElement) => {
  const width = rectSvg.getAttribute("width");
  const height = rectSvg.getAttribute("height");
  const fill = rectSvg.getAttribute("fill");

  console.log(width, height, fill);
}

const dividePolygon = (polygonSvg: SVGElement) => {
}