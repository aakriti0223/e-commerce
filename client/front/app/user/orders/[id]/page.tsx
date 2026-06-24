import Header from '@/components/modules/landing/Header';
import Footer from '@/components/modules/landing/Footer';
import OrderDetailClient from '@/components/modules/orders/OrderDetailClient';

export const revalidate = false;

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <>
      <Header />
      <OrderDetailClient orderId={id} />
      <Footer />
    </>
  );
}

export function generateMetadata() {
  return {
    title: 'Order Details - Storefront',
    description: 'View your order details',
  };
}