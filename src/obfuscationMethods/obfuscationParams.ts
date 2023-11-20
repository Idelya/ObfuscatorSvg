export interface ObfuscationParams {
  elementTag: "original" | "path";
  addIrrelevantFigures: boolean;
  addIrrelevantAttributes: boolean;
  randomizeElements: boolean;
  fillType: "original" | "random";
  circleParts: number;
  divisionStrength: number;
  figureSplitBy: "no" | "opacity";
}
