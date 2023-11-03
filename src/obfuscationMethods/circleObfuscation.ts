export const divideCircle = (circleSvg: SVGElement) => {
    const r = circleSvg.getAttribute("r");
    const cx = circleSvg.getAttribute("cx");
    const cy = circleSvg.getAttribute("cy");
    const fill = circleSvg.getAttribute("fill");

    console.log(r, cx, cy, fill);
}