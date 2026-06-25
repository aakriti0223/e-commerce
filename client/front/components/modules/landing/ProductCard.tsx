'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product.types';
import styles from './product-card.module.scss';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=60';

export default function ProductCard({ product }: { product: Product }) {
  const id = product.id;

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

  // const categoryName =
  //   typeof product.category === 'string'
  //     ? product.category
  //     : product.category?.name || 'Product';

  const categoryName = product.category || 'Product';

  const stock = Number(product.stock);
  const isOutOfStock = stock <= 0;

  return (
    <Link href={`/${id}`} className={styles.card}>
      {/* image */}
      <div className={styles.imageWrapper}>
        <Image src={imageUrl} alt={product.name} width={400} height={400} />

        {isOutOfStock && (
          <span className={styles.badge}>Out of Stock</span>
        )}
      </div>

      {/* content */}
      <div className={styles.content}>
        <span className={styles.category}>{categoryName}</span>

        <h3 className={styles.name}>{product.name}</h3>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.footer}>
          <span className={styles.price}>{priceInRupees}</span>

          <span className={isOutOfStock ? styles.outOfStock : styles.inStock}>
            {isOutOfStock ? 'Out of Stock' : `${stock} In Stock`}
          </span>
        </div>
      </div>
    </Link>
  );
}