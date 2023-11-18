export interface ObfuscationParams {
  divisionStrength: number;
  elementTag: "original" | "path";
  addIrrelevantFigures: boolean;
  addIrrelevantAttributes: boolean;
  randomizeElements: boolean;
  figureSplitBy: "no" | "opacity";
  fill: "original" | "random" | "highContrast";
}
