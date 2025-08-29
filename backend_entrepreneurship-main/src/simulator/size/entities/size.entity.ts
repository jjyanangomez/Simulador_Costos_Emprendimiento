// src/simulator/size/domain/entities/size.entity.ts

export class Size {
  sizeId?: number;
  sizeName: string;

  constructor(sizeName: string, sizeId?: number) {
    this.sizeId = sizeId;
    this.sizeName = sizeName;
  }
}