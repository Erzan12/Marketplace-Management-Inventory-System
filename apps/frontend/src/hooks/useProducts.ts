import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Product } from "@/types";

export const useProducts = () => {
    return useQuery<Product[]>({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await api.get('/products');
            return response.data;
        },
    });
};
