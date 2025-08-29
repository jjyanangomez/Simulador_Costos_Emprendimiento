export interface BusinessDTO {
  id: number;
  userId: number;
  businessType: string;
  name: string;
  location: string;
  sizeId: number;
  createdAt?: Date;
}
