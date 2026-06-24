'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

import CheckoutSteps from './CheckoutSteps';
import CheckoutHeader from './CheckoutHeader';
import PaymentMethodCard from './PaymentMethodCard';
import {
  StripePaymentForm,
  StripePaymentProvider,
} from './stripe-payment-form';

import styles from './checkout.module.scss';

import { usePayment } from '@/hooks/usePayment';
import { useCart } from '@/hooks/useCart';
import { useOrder } from '@/hooks/useOrder';
import { OrderItem } from '@/types/orders.types';

type Step = 1 | 2 | 3;

export default function CheckoutClient() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  const orderCreateTriedRef = useRef(false);

  const { totalPrice, items, clearAllCart } = useCart();
  const { createOrder } = useOrder();
  const { clientSecret, confirmPayment, createPaymentIntent } = usePayment();

  const shippingAddress =
    'Flat No. 204, Lake View Residency, Arera Colony, Bhopal, Madhya Pradesh 462016, India';

  const priceInRupees = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(Number(totalPrice));

  const handlePaymentMethodSelect = (method: string) => {
    setSelectedPayment(method);
    setStripeError(null);

    if (!orderId && !clientSecret) {
      orderCreateTriedRef.current = false;
      setRetryCount((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (items.length === 0 && !orderId) {
      router.push('/cart');
    }
  }, [items.length, orderId, router]);

  useEffect(() => {
    const createOrderAutomatically = async () => {
      if (!selectedPayment) return;
      if (items.length === 0) return;
      if (orderId) return;
      if (clientSecret) return;
      if (isCreatingOrder) return;
      if (orderCreateTriedRef.current) return;

      orderCreateTriedRef.current = true;
      setIsCreatingOrder(true);
      setStripeError(null);

      try {
        const cartItems: OrderItem[] = items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: Number(item.product.price),
        }));

        const order = await createOrder({
          items: cartItems,
          shippingAddress,
        });

        if (!order) {
          throw new Error('Failed to create order');
        }

        setOrderId(order.id);

        if (selectedPayment === 'stripe') {
          const paymentCreated = await createPaymentIntent({
            orderId: order.id,
            amount: totalPrice,
            description: 'Order payment for ecommerce purchase',
            currency: 'inr',
          });

          if (!paymentCreated) {
            throw new Error('Failed to create payment intent');
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to create order';

        setStripeError(errorMessage);
        console.log('Order creation error:', error);
      } finally {
        setIsCreatingOrder(false);
      }
    };

    createOrderAutomatically();
  }, [
    selectedPayment,
    retryCount,
    orderId,
    clientSecret,
    isCreatingOrder,
    items,
    createOrder,
    createPaymentIntent,
    totalPrice,
    shippingAddress,
  ]);

  const handleRetryOrder = () => {
    orderCreateTriedRef.current = false;
    setStripeError(null);
    setRetryCount((prev) => prev + 1);
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      setCurrentStep(3);

      const confirmed = await confirmPayment({
        orderId,
        paymentIntentId,
      });

      if (!confirmed) {
        throw new Error('Failed to confirm payment');
      }

      await clearAllCart();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to confirm payment';

      setStripeError(errorMessage);
    }
  };

  const handlePaymentError = (error: string) => {
    setStripeError(error);
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <CheckoutHeader />

        <CheckoutSteps currentStep={currentStep} />

        <div className={styles.content}>
          {currentStep === 1 && (
            <div className={styles.stepContent}>
              <h2>Select Payment Method</h2>

              <div className={styles.paymentMethods}>
                <PaymentMethodCard
                  method="stripe"
                  selectedMethod={selectedPayment}
                  onSelect={handlePaymentMethodSelect}
                  icon={<CreditCard size={22} />}
                  title="Credit / Debit Card"
                  description="Pay securely with stripe"
                >
                  {stripeError && (
                    <div className={styles.errorMessage}>
                      {stripeError}

                      <button
                        type="button"
                        className={styles.retryButton}
                        onClick={handleRetryOrder}
                      >
                        Try again
                      </button>
                    </div>
                  )}

                  {isCreatingOrder && !clientSecret && (
                    <div className={styles.loadingContainer}>
                      <div className={styles.spinner}></div>
                      <span>Creating your order...</span>
                    </div>
                  )}

                  {clientSecret && (
                    <StripePaymentProvider clientSecret={clientSecret}>
                      <StripePaymentForm
                        amount={totalPrice}
                        onSuccess={handlePaymentSuccess}
                        onError={handlePaymentError}
                      />
                    </StripePaymentProvider>
                  )}
                </PaymentMethodCard>
              </div>

              <div className={styles.summary}>
                <h3>Order summary</h3>

                <div className={styles.summaryRow}>
                  <span>Items ({items.length})</span>
                  <span>{priceInRupees}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span>Free</span>
                </div>

                <hr className={styles.divider} />

                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <span>{priceInRupees}</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className={styles.stepContent}>
              <div className={styles.success}>
                <Check size={80} strokeWidth={2} />

                <h2>Order placed successfully</h2>

                <p>Your order #{orderId} has been confirmed</p>

                <p className={styles.shippingInfo}>
                  Shipping to <strong>{shippingAddress}</strong>
                </p>

                <button
                  onClick={() => router.push('/user/orders')}
                  className={styles.continueButton}
                >
                  Go to my orders
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}