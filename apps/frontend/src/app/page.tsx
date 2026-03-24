// import { ComponentExample } from "@/components/component-example";

// export default function Page() {
  
// return <ComponentExample />;
// }

'use client';

import Link from 'next/link';
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';

export default function Home() {
  const { data: products, isLoading, isError } = useProducts();
  // const router = useRouter();

  return (
    <>
      <Head>
        <title>Product Inventory</title>
      </Head>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Product Inventory</h1>
        <Link href="/login" className="text-blue-500 underline mb-4 inline-block">
          Go to Login
        </Link>

        {isLoading && <p>Loading products...</p>}
        {isError && <p className="text-red-500">Failed to load products.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
    </>
  );
}