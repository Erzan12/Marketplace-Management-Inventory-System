'use client';

import './globals.css';
import { Inter } from "next/font/google";
import { CartDrawer } from '@/components/cart-drawer';
import { CartProvider } from "@/contexts/cart-context";
import { Navbar } from '@/components/core/navbar';
import QueryProvider from '@/providers/query-provider';
import { AuthProvider } from '@/contexts/auth-context';

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {children}
              <CartDrawer />
            </CartProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
