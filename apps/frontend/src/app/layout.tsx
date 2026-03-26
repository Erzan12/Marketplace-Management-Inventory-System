// src/app/layout.tsx
'use client';

import './globals.css';
import { ReactQueryProvider } from '@/components/providers/react-query-provider';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Inter } from "next/font/google";
import { CartDrawer } from '@/components/cart-drawer';
import { CartProvider } from "@/contexts/cart-context";
import { Navbar } from '@/components/core/navbar';
import QueryProvider from '@/providers/query-provider';

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <CartProvider>
            <Navbar />
            {children}
            <CartDrawer />
          </CartProvider>
        </QueryProvider>
      </body>
    </html>
  )
}

// Extracted to its own component so we can use hooks
// function Navbar() {
//   const { data: cartItems } = useCart();
//   const cartCount = cartItems?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

//   return (
//     <header className="bg-white shadow p-4 flex justify-between items-center">
//       {/* <Link href="/" className="text-lg font-bold">Product Inventory System</Link>
//       <Link href="/cart" className="relative">
//         <ShoppingCart size={24} />
//         {cartCount > 0 && (
//           <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
//             {cartCount}
//           </span>
//         )}
//       </Link> */}
//     </header>
//   );
// }
