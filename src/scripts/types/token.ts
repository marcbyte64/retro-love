export type Token = {
  value: string | number;
  type: "string" | "number" | "variable" | "operator" | "separator" | "comparisonoperator";
};
