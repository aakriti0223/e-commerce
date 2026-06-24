'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import styles from './orders.module.scss';
import { OrderService } from '@/services/api/order.service';
import { Order } from '@/types/orders.types';

export default function OrderDetailClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const priceInRupees = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(Number(amount || 0));

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
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await OrderService.getOrderById(orderId);

        if (response.data) {
          setOrder(response.data);
        } else {
          setError(response.message || 'Order not found');
        }
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to load order details';

        setError(Array.isArray(message) ? message[0] : message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.centerBox}>
            <div className={styles.spinner}></div>
            <p>Loading order details...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !order) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.centerBox}>
            <Package size={56} />
            <h2>Order not found</h2>
            <p>{error}</p>

            <Link href="/user/orders" className={styles.button}>
              Back to orders
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const orderItems = order.items || order.cartItems || [];

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Order Details</h1>
          <p>Order #{order.id}</p>
        </div>

        <div className={styles.orderCard}>
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

            <Link href="/user/orders" className={styles.detailsButton}>
              Back to Orders
            </Link>
          </div>
        </div>

        {orderItems.length > 0 && (
          <div className={styles.orderCard}>
            <h2>Items</h2>

            {orderItems.map((item, index) => (
              <div key={index} className={styles.orderInfo}>
                <div>
                  <span>Product ID</span>
                  <strong>{item.productId}</strong>
                </div>

                <div>
                  <span>Quantity</span>
                  <strong>{item.quantity}</strong>
                </div>

                <div>
                  <span>Price</span>
                  <strong>{priceInRupees(item.price)}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}