
export class Status {
  statusId?: number;
  statusName: string;

  constructor(statusName: string, statusId?: number) {
    this.statusId = statusId;
    this.statusName = statusName;
  }
}