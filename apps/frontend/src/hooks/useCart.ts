import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { CartItem } from '@/types';

export const useCart = () => {
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('token')
        : null;

    return useQuery<CartItem[]>({
        queryKey: ['cart'],
        queryFn: async () => {
            const res = await api.get('/api/orders/my-cart');
            return res.data;
        },
        enabled: !!token
    })
}
