import React from 'react';
import Footer from '@/components/modules/landing/Footer';
import Header from '@/components/modules/landing/Header';
import CartClient from '@/components/modules/cart/CartClient';

// Nextjs ISR caching strategy
export const revalidate = false;

export default function Page() {
  return (
    <>
      <Header />

      <main style={{ minHeight: '60vh' }}>
        <CartClient />
      </main>

      <Footer />
    </>
  );
}

// Nextjs dynamic metadata
export function generateMetadata() {
  return {
    title: 'Cart - Storefront',
    description: 'Shopping cart page',
  };
}