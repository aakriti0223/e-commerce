import Header from '@/components/modules/landing/Header';
import Footer from '@/components/modules/landing/Footer';
import OrdersClient from '@/components/modules/orders/OrdersClient';

export default function Page() {
  return (
    <>
      <Header />
      <OrdersClient />
      <Footer />
    </>
  );
}

export function generateMetadata() {
  return {
    title: 'My Orders - Storefront',
    description: 'View your orders',
  };
}