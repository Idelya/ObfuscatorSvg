export interface ObfuscationParams {
  elementTag: ELEMENT_TAG_PARAMS;
  addIrrelevantFigures: boolean;
  addIrrelevantAttributes: boolean;
  randomizeElements: boolean;
  fillType: "original" | "random";
  circleParts: number;
  divisionStrength: number;
  figureSplitBy: "no" | "opacity";
}

export enum ELEMENT_TAG_PARAMS {
  ORIGNAL = "original",
  PATH = "path",
}

export enum FILL_TYPE_PARAMS {
  ORIGNAL = "original",
  RANDOM = "random",
}

export enum FIGURE_SPLIT_BY_PARAMS {
  NO = "no",
  OPACITY = "opacity",
}
