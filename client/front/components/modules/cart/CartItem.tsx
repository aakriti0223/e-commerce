'use client';

import Link from 'next/link';
import styles from './cart-item.module.scss';
import Image from 'next/image';
import type { CartItem as CartItemType } from '@/types/cart.types';
import { Trash2 } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60';

export default function CartItem({ item }: { item?: CartItemType }) {
  const {
    decrementProductQuantity,
    incrementProductQuantity,
    removeProductFromCart,
  } = useCart();

  if (!item || !item.product) {
    return null;
  }

  const { product, quantity } = item;
  const itemTotal = Number(product.price) * quantity;

  const productPriceInRupees = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(Number(product.price));

  const itemTotalInRupees = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(itemTotal);

  const imageUrl =
    product.imageUrl && product.imageUrl.trim() !== ''
      ? product.imageUrl.trim()
      : FALLBACK_IMAGE;

  const handleDecrement = async () => {
    await decrementProductQuantity(product.id);
  };

  const handleIncrement = async () => {
    if (quantity < Number(product.stock)) {
      await incrementProductQuantity(product.id);
    } else {
      alert(`Only ${product.stock} items available in stock`);
    }
  };

  const handleRemove = async () => {
    if (window.confirm(`Remove ${product.name} from cart? `)) {
      await removeProductFromCart(product.id);
    }
  };

  return (
    <div className={styles.cartItem}>
      <Link className={styles.imageWrapper} href={`/${product.id}`}>
        <Image
          src={imageUrl}
          alt={product.name}
          width={120}
          height={120}
        />
      </Link>

      <div className={styles.details}>
        <div className={styles.info}>
          <Link className={styles.name} href={`/${product.id}`}>
            {product.name}
          </Link>

          <span className={styles.category}>{product.categoryId}</span>

          <span className={styles.price}>{productPriceInRupees}</span>

          {Number(product.stock) <= 5 && (
            <span className={styles.lowStock}>
              Only {product.stock} left in stock
            </span>
          )}
        </div>

        <div className={styles.actions}>
          <div className={styles.quantityControl}>
            <button
              className={styles.quantityButton}
              onClick={handleDecrement}
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
              type="button"
            >
              -
            </button>

            <span className={styles.quantityValue}>{quantity}</span>

            <button
              className={styles.quantityButton}
              onClick={handleIncrement}
              disabled={quantity >= Number(product.stock)}
              aria-label="Increase quantity"
              type="button"
            >
              +
            </button>
          </div>

          <div className={styles.itemTotal}>{itemTotalInRupees}</div>

          <button
            className={styles.removeButton}
            onClick={handleRemove}
            aria-label="Remove item"
            type="button"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}