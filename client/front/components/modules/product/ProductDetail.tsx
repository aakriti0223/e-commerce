'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types/product.types';
import styles from './product-detail.module.scss';
import { useCart } from '@/hooks/useCart';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60';

export default function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { items, addProductToCart } = useCart();

  const stock = Number(product.stock);
  const isInStock = stock > 0;
  const [quantity, setQuantity] = useState(1);

  const isInCart = items.some((item) => item.product?.id === product.id);

  const imageUrl =
    product.imageUrl &&
    product.imageUrl.trim() !== '' &&
    !product.imageUrl.includes('example.com')
      ? product.imageUrl.trim()
      : FALLBACK_IMAGE;

  const priceInRupees = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(Number(product.price));

  const categoryValue = product.category as unknown;

  const categoryName =
    typeof categoryValue === 'string'
      ? categoryValue
      : (categoryValue as { name?: string })?.name || 'Product';

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    if (!isInStock) return;

    await addProductToCart(product, quantity);
    setQuantity(1);
  };

  const handleGoToCart = () => {
    router.push('/cart');
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.imageWrapper}>
            <Image
              src={imageUrl}
              alt={product.name}
              width={600}
              height={600}
              priority
            />
          </div>

          <div className={styles.info}>
            <span className={styles.category}>{categoryName}</span>

            <h1 className={styles.title}>{product.name}</h1>

            <p className={styles.price}>{priceInRupees}</p>

            <span
              className={`${styles.stock} ${
                !isInStock ? styles.outOfStock : ''
              }`}
            >
              {isInStock ? `${stock} available in stock` : 'Out of Stock'}
            </span>

            <hr className={styles.divider} />

            <p className={styles.description}>{product.description}</p>

            <hr className={styles.divider} />

            {isInStock && (
              <div className={styles.quantitySection}>
                <label htmlFor="quantity" className={styles.label}>
                  Quantity
                </label>

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
                    disabled={quantity >= stock}
                    aria-label="Increase quantity"
                    type="button"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className={styles.buttonGroup}>
              <button
                className={styles.addToCartButton}
                onClick={handleAddToCart}
                disabled={!isInStock}
                type="button"
              >
                {isInStock ? 'Add to Cart' : 'Out of Stock'}
              </button>

              {isInCart && (
                <button
                  className={styles.goToCartButton}
                  onClick={handleGoToCart}
                  type="button"
                >
                  Go to Cart
                </button>
              )}
            </div>

            <p className={styles.sku}>SKU: {product.sku}</p>
          </div>
        </div>
      </div>
    </section>
  );
}