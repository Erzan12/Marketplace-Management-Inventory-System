'use client';

import { useCart } from '@/hooks/useCart'; // We will create this next
import Link from 'next/link';
import type { CartItem } from '@/types';

export default function CartPage() {
    const { data: cart, isLoading, isError } = useCart();

    if (isLoading) return <p>Loading cart...</p>;
    if (isError) return <p className="text-red-500">Failed to load cart.</p>;

    const total = cart?.reduce((acc: number, item: CartItem) => {
    return acc + item.quantity * item.product.price;
    }, 0);

    return (
        <main className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-2x1 font-bold mb-4">Your Cart</h1>

            {cart?.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="space-y-4">
                    {cart?.map((item: CartItem) => (
                        <div key={item.id} className="flex justify-between border-b pb-2">
                            <div>
                                <p className="font-semibold">{item.product.name}</p>
                                <p>Qty: {item.quantity}</p>
                            </div>
                            <p className="text-right">
                                ₱{(item.quantity * item.product.price).toLocaleString()}
                            </p>
                        </div>
                    ))}
                    <div className="flex justify-between font-bold text-lg border-t pt-4">
                        <p>Total:</p>
                        <p>₱{total?.toLocaleString()}</p>
                    </div>

                    <form action="/api/checkout" method="POST">
                        <button
                        type="submit"
                        className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
                        >
                        Checkout
                        </button>
                    </form>
                </div>
            )}
            <Link href="/" className="text-blue-500 mt-4 inline-block">
                ← Continue Shopping
            </Link>
        </main> 
    );
}