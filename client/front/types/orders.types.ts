export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  shippingAddress?: string;
}

export interface Order {
  id: string;
  userId: string;

  cartItems?: OrderItem[];
  items?: OrderItem[];

  shippingAddress: string;

  totalAmount?: number;
  total?: number;
  totalPrice?: number;
  amount?: number;

  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  data?: Order;
  message?: string;
}

export interface OrdersResponse {
  success?: boolean;
  data?:
    | Order[]
    | {
        data?: Order[];
        orders?: Order[];
        items?: Order[];
        results?: Order[];
        meta?: unknown;
      };
  orders?: Order[];
  items?: Order[];
  results?: Order[];
  message?: string;
}