'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ShoppingBag } from 'lucide-react';
import styles from './orders.module.scss';
import { OrderService } from '@/services/api/order.service';
import { Order } from '@/types/orders.types';
import { useRouter } from 'next/navigation';

type OrdersApiResponse = {
  success?: boolean;
  data?:
    | Order[]
    | {
        data?: Order[];
        orders?: Order[];
        items?: Order[];
        results?: Order[];
      };
  orders?: Order[];
  items?: Order[];
  results?: Order[];
  message?: string;
};

export default function OrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const priceInRupees = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Number(amount || 0));

  const extractOrders = (response: OrdersApiResponse): Order[] => {
    if (Array.isArray(response)) return response;

    if (Array.isArray(response.data)) return response.data;

    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }

    if (response.data && Array.isArray(response.data.orders)) {
      return response.data.orders;
    }

    if (response.data && Array.isArray(response.data.items)) {
      return response.data.items;
    }

    if (response.data && Array.isArray(response.data.results)) {
      return response.data.results;
    }

    if (Array.isArray(response.orders)) return response.orders;
    if (Array.isArray(response.items)) return response.items;
    if (Array.isArray(response.results)) return response.results;

    return [];
  };

  const getOrderTotal = (order: Order) => {
    if (order.totalAmount) return Number(order.totalAmount);
    if (order.total) return Number(order.total);
    if (order.totalPrice) return Number(order.totalPrice);
    if (order.amount) return Number(order.amount);

    if (Array.isArray(order.items)) {
      return order.items.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      );
    }

    if (Array.isArray(order.cartItems)) {
      return order.cartItems.reduce(
        (sum, item) =>
          sum + Number(item.price || 0) * Number(item.quantity || 0),
        0
      );
    }

    return 0;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await OrderService.getMyOrders();

        console.log('Orders API response:', response);

        const orderList = extractOrders(response as OrdersApiResponse);
        setOrders(orderList);
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to load orders';

        setError(Array.isArray(message) ? message[0] : message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.centerBox}>
            <div className={styles.spinner}></div>
            <p>Loading your orders...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.centerBox}>
            <Package size={56} />
            <h2>Unable to load orders</h2>
            <p>{error}</p>

            <Link href="/cart" className={styles.button}>
              Back to cart
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.centerBox}>
            <ShoppingBag size={60} />
            <h2>No orders found</h2>
            <p>You have not placed any orders yet.</p>

            <Link href="/" className={styles.button}>
              Continue shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>My Orders</h1>
          <p>Track and view your recent purchases</p>
        </div>

        <div className={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderTop}>
                <div>
                  <h2>Order #{order.id.slice(0, 8)}</h2>
                  <p>
                    Placed on{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <span className={styles.status}>
                  {order.status || 'Processing'}
                </span>
              </div>

              <div className={styles.orderInfo}>
                <div>
                  <span>Total Amount</span>
                  <strong>{priceInRupees(getOrderTotal(order))}</strong>
                </div>

                <div>
                  <span>Shipping Address</span>
                  <strong>{order.shippingAddress || 'Not provided'}</strong>
                </div>
              </div>

              <div className={styles.orderBottom}>
                <div className={styles.confirmText}>
                  <Package size={20} />
                  <span>Order confirmed successfully</span>
                </div>

                <button
                  type="button"
                  className={styles.detailsButton}
                  onClick={() => router.push(`/user/orders/${order.id}`)}
                >
                  Order Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}