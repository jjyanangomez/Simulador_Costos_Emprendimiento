export class OmittedCostResult {
  id?: number;
  analysisId: number;
  omittedCost: string;
  importance: string;

  constructor(
    analysisId: number,
    omittedCost: string,
    importance: string,
    id?: number,
  ) {
    this.id = id;
    this.analysisId = analysisId;
    this.omittedCost = omittedCost;
    this.importance = importance;
  }
}