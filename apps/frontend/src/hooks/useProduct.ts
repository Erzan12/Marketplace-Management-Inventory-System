import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export interface ProductImage {
  url: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  compareAtPrice: string | number | null;
  slug: string;
  images: ProductImage[];
  inventory: {
    quantity: number;
  } | null;
}

export function useProduct(slug: string) {
  return useQuery<ProductResponse>({
    queryKey: ['product', slug],
    queryFn: async () => {
      const { data } = await apiClient.get(`/products/slug/${slug}`);
      return data;
    },
    enabled: !!slug,
  });
}