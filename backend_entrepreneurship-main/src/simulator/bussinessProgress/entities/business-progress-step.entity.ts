
export class BusinessProgressStep {
  id?: number;
  businessId: number;
  moduleId: number;
  statusId: number;
  startDate?: Date;
  completionDate?: Date;

  constructor(
    businessId: number,
    moduleId: number,
    statusId: number,
    id?: number,
    startDate?: Date,
    completionDate?: Date,
  ) {
    this.id = id;
    this.businessId = businessId;
    this.moduleId = moduleId;
    this.statusId = statusId;
    this.startDate = startDate;
    this.completionDate = completionDate;
  }
}