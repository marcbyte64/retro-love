export type Token = {
  value: string | number;
  type:
    | "string"
    | "number"
    | "variable"
    | "keyword"
    | "command"
    | "operator"
    | "separator"
    | "comparisonoperator";
};
