export interface Order {
    id: string;
    userId: string;
    product: string;
    quantity: number;
    status: string;
    createdAt: Date;
  }