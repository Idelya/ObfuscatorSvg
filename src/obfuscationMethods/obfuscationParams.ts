export interface ObfuscationParams {
  divisionStrength: number;
  elementTag: "original" | "path";
  addIrrelevantFigures: boolean;
  addIrrelevantAttributes: boolean;
  randomizeElements: boolean;
  figureSplitBy: "no" | "opacity";
  fillType: "original" | "random" | "highContrast";
}
