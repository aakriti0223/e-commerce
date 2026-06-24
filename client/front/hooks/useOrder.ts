import { CartService } from '@/services/api/cart.service';
import { OrderService } from '@/services/api/order.service';
import { IRootState } from '@/store';
import { CreateOrderRequest, Order } from '@/types/orders.types';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

export function useOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const guestCart = useSelector((state: IRootState) => state.cart.items);

  const createOrder = useCallback(
    async (data: CreateOrderRequest): Promise<Order | null> => {
      setLoading(true);
      setError(null);

      try {
        // Merge guest cart first, but don't stop checkout if merge fails
        if (guestCart.length > 0) {
          try {
            await CartService.mergeCart(
              guestCart.map((item) => ({
                productId: item.product.id,
                quantity: item.quantity,
              }))
            );
          } catch (mergeError) {
            console.log('Cart merge failed, continuing order creation:', mergeError);
          }
        }

        const response = await OrderService.createOrder(data);

        if (response.data) {
          setOrder(response.data);
          return response.data;
        }

        throw new Error(response.message ?? 'Failed to create order');
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          'Failed to create order';

        const errorMessage = Array.isArray(message) ? message[0] : message;

        console.log('Create order error:', error);
        setError(errorMessage);

        return null;
      } finally {
        setLoading(false);
      }
    },
    [guestCart]
  );

  return {
    order,
    error,
    createOrder,
    loading,
  };
}