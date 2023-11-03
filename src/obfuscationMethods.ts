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
  "divide into parts, randomize, change to paths": (svg: SVGElement) => {
    svg.childNodes.forEach((elem, _) => {
      const svgChild = elem as SVGElement;
      if (svgChild.tagName === "circle"){
        divideCircle(svgChild);
      } else if (svgChild.tagName === "rect") {
        divideRect(svgChild, svg);
      } else if (svgChild.tagName === "polygon") {
        dividePolygon(svgChild);
      }
      else {
        throw elem;
      }
    });
    svg.setAttribute("method", "method 1");
    return svg;
  }
};

const divideCircle = (circleSvg: SVGElement) => {
  const r = circleSvg.getAttribute("r");
  const cx = circleSvg.getAttribute("cx");
  const cy = circleSvg.getAttribute("cy");
  const fill = circleSvg.getAttribute("fill");

  console.log(r, cx, cy, fill);
}

const divideRect = (rectSvg: SVGElement, parentSvg: SVGAElement) => {
  const width = parseInt(rectSvg.getAttribute("width")!);
  const height = parseInt(rectSvg.getAttribute("height")!);
  const fill = rectSvg.getAttribute("fill");

  const divisionDepth = 4;
  const changeToPaths = true;
  const rectanglePaths = getRectanglePaths(width, height, divisionDepth, changeToPaths, fill);

  parentSvg.innerHTML = "";
  rectanglePaths.forEach(p => {
    parentSvg.innerHTML += p
  });
}

const dividePolygon = (polygonSvg: SVGElement) => {
  console.log(polygonSvg);
}

const divideRectangle = (width: number, height: number, xInit: number, yInit: number, depth: number, accum: string[], changeToPaths: boolean, fill: string) => {
  if (depth > 1){
    divideRectangle(width/2,height/2,xInit,yInit, depth - 1, accum, changeToPaths, fill);
    divideRectangle(width/2,height/2,xInit + width/2,yInit, depth - 1, accum, changeToPaths, fill);
    divideRectangle(width/2,height/2,xInit,yInit + height/2, depth - 1, accum, changeToPaths, fill);
    divideRectangle(width/2,height/2,xInit + width/2,yInit + height/2, depth - 1, accum, changeToPaths, fill);
  } else {
    if (changeToPaths) {
      accum.push(`<path d="M ${xInit} ${yInit} L ${xInit + width/2} ${yInit} L ${xInit + width/2} ${yInit + height/2} L ${xInit} ${yInit + height/2} Z" fill="${fill}"></path>`);
      accum.push(`<path d="M ${xInit + width/2} ${yInit} L ${xInit + width} ${yInit} L ${xInit + width} ${yInit + height/2} L ${xInit + width/2} ${yInit + height/2} Z" fill="${fill}"></path>`);
      accum.push(`<path d="M ${xInit} ${yInit + height/2} L ${xInit + width/2} ${yInit + height/2} L ${xInit + width/2} ${yInit + height} L ${xInit} ${yInit + height} Z" fill="${fill}"></path>`);
      accum.push(`<path d="M ${xInit + width/2} ${yInit + height/2} L ${xInit + width} ${yInit + height/2} L ${xInit + width} ${yInit + height} L ${xInit + width/2} ${yInit + height} Z" fill="${fill}"></path>`);
    } else {
      accum.push(`<rect x="${xInit}" y="${yInit}" width="${width/2}" height="${height/2}" fill="${fill}"></rect>`);
      accum.push(`<rect x="${xInit + width/2}" y="${yInit}" width="${width/2}" height="${height/2}" fill="${fill}"></rect>`);
      accum.push(`<rect x="${xInit}" y="${yInit + height/2}" width="${width/2}" height="${height/2}" fill="${fill}"></rect>`);
      accum.push(`<rect x="${xInit + width/2}" y="${yInit + height/2}" width="${width/2}" height="${height/2}" fill="${fill}"></rect>`);
    }
  }
}

const getRectanglePaths = (width: number, height: number, divisionDepth: number, changeToPaths: boolean, fill: string) => {
  const paths: string[] = [];
  divideRectangle(width, height, 0, 0, divisionDepth, paths, changeToPaths, fill);
  shuffle(paths);
  return paths;
}

function shuffle(array: any[]) {
  let currentIndex = array.length;
  let randomIndex = 0;

  // While there remain elements to shuffle
  while (currentIndex > 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}