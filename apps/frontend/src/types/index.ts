
// src/types/index.ts
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: Product; // Nested relation from Prisma
  createdAt: string; // or Date if you don’t stringify in JSON
  updatedAt: string; // same as above
}

export interface User {
  id: number;
  email: string;
  password:string;
  role: string;
  createdAt: string;
}