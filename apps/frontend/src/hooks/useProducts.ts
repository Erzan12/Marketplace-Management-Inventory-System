import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Product } from '@/types/product';


export interface ProductResponse {
  data: Product[]; // You can define a strict Product interface later based on your Swagger output
  meta: {
    totalItems: number;
    page: number;
    lastPage: number;
  };
}

export function useProducts(params?: {
  category?: string;
  search?: string;
  page?: number;
}) {
  return useQuery<ProductResponse>({
    queryKey: ['products', params],
    queryFn: async () => {
      const { data } = await apiClient.get<ProductResponse>('/products', {
        params,
      });
      return data;
    },
  });
}