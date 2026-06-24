import { IRootState } from "@/store";
import { CartItem } from "@/types/cart.types";
import { Product } from "@/types/product.types";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart as addToCartAction,
  clearAllCart as clearAllCartAction,
  decrementQuantity as decrementQuantityAction,
  incrementQuantity as incrementQuantityAction,
  removeFromCart as removeFromCartAction,
} from "@/store/slices/cartSlice";

export function useCart() {
  const reduxCart = useSelector((state: IRootState) => state.cart);

  const items: CartItem[] = reduxCart.items;
  const dispatch = useDispatch();

  const addProductToCart = async (product: Product, quantity: number = 1) => {
    dispatch(
      addToCartAction({
        product,
        quantity,
      })
    );
  };

  const decrementProductQuantity = async (productId: string) => {
    dispatch(decrementQuantityAction(productId));
  };

  const incrementProductQuantity = async (productId: string) => {
    dispatch(incrementQuantityAction(productId));
  };

  const removeProductFromCart = async (productId: string) => {
    dispatch(removeFromCartAction(productId));
  };

  const clearAllCart = async () => {
    dispatch(clearAllCartAction());
  };

  return {
    items,
    totalItems: reduxCart.totalItems,
    totalPrice: reduxCart.totalPrice,
    addProductToCart,
    decrementProductQuantity,
    incrementProductQuantity,
    removeProductFromCart,
    clearAllCart,
  };
}