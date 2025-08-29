
export class FinancialRecord {
  recordId?: number;
  businessId: number;
  moduleId: number;
  name: string;
  amount: number;
  registrationDate?: Date;

  constructor(
    businessId: number,
    moduleId: number,
    name: string,
    amount: number,
    recordId?: number,
    registrationDate?: Date,
  ) {
    this.recordId = recordId;
    this.businessId = businessId;
    this.moduleId = moduleId;
    this.name = name;
    this.amount = amount;
    this.registrationDate = registrationDate;
  }
}