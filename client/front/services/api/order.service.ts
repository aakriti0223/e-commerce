import {
  CreateOrderRequest,
  OrderResponse,
  OrdersResponse,
} from '@/types/orders.types';
import { apiClient } from './axios.config';

export const OrderService = {
  createOrder: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    const response = await apiClient.post<OrderResponse>('/orders', data);
    return response.data;
  },

  getMyOrders: async (): Promise<OrdersResponse> => {
    const response = await apiClient.get<OrdersResponse>('/orders');
    return response.data;
  },

  getOrderById: async (id: string): Promise<OrderResponse> => {
    const response = await apiClient.get<OrderResponse>(`/orders/${id}`);
    return response.data;
  },
};