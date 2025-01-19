export type Product = {
  prod_id: string;
  name: string;
  price: number;
  creation_date?: string;
  warehouse?: {
    name: string;
    qty: number;
  };
};
