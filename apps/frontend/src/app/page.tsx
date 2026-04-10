'use client';

import { Hero } from '@/components/core/hero';
import { Categories } from '@/components/core/categories';
import { FeaturedProducts } from '@/components/core/featured-products';
import { Newsletter } from '@/components/core/newsletter';
import { Footer } from '@/components/core/footer';

export default function Home() {

  return (
    <main className="min-h-screen">
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Newsletter />
      <Footer />
      console.log(&quot;deploy fix&quot;)
    </main>
  )
}