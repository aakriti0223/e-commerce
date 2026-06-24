'use client';

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';

import {
  Appearance,
  loadStripe,
  StripeElementsOptions,
} from '@stripe/stripe-js';

import styles from './stripe-payment-form.module.scss';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function StripePaymentProvider({
  clientSecret,
  children,
}: {
  clientSecret: string;
  children: React.ReactNode;
}) {
  const appearance: Appearance = {
    theme: 'stripe',
    variables: {
      colorPrimary: '#de6824',
      colorBackground: '#ffffff',
      colorText: '#1e293b',
      fontFamily: 'Poppins, sans-serif',
      spacingUnit: '4px',
      borderRadius: '6px',
    },
  };

  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
  };

  return (
    <Elements key={clientSecret} stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}

export function StripePaymentForm({
  amount,
  onSuccess,
  onError,
}: {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [isLoading, setIsLoading] = useState(false);
  const [isElementReady, setIsElementReady] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const priceInRupees = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(Number(amount));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements || !isElementReady) {
      setErrorMessage('Payment form is still loading. Please wait.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        const message = error.message || 'Payment failed';
        setErrorMessage(message);
        onError(message);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      }
    } catch (error) {
      console.log('Payment error:', error);
      setErrorMessage('An unexpected error occurred');
      onError('Unexpected error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <PaymentElement
        onReady={() => {
          setIsElementReady(true);
        }}
        onLoadError={(event) => {
          const message =
            event.error?.message || 'Payment form failed to load';

          setErrorMessage(message);
          onError(message);
        }}
      />

      <div className={styles.submitContainer}>
        <button
          type="submit"
          disabled={!stripe || !elements || !isElementReady || isLoading}
          className={styles.submitButton}
        >
          {isLoading ? (
            <>
              <Loader2 className={styles.spinner} size={18} />
              Processing...
            </>
          ) : (
            `Pay ${priceInRupees}`
          )}
        </button>
      </div>

      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </form>
  );
}