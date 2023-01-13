export interface InputCreateProductDTO {
  name: string;
  price: number;
  type?: string;
}

export interface OutputCreateProductDTO {
  id: string;
  name: string;
  price: number;
}
