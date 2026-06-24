// 'use client';

// import Link from 'next/link';
// import { ShoppingCart } from 'lucide-react';
// import { useCart } from '../../../hooks/useCart';
// import styles from './cart.module.scss';
// import CartItem from './CartItem';
// import { useAuth } from '@/hooks/useAuth';
// import { useRouter } from 'next/navigation';

// export default function CartClient() {
//   const { items, clearAllCart, totalPrice } = useCart();
//   const router = useRouter();
//   const { isAuthenticated } = useAuth();

//   const validItems = items.filter((item) => item && item.product);

//   const priceInRupees = new Intl.NumberFormat('en-IN', {
//     style: 'currency',
//     currency: 'INR',
//   }).format(Number(totalPrice));

//   const handleClearCart = async () => {
//     if (window.confirm('Are you sure you want to clear your entire cart?')) {
//       await clearAllCart();
//     }
//   };

//   const handleCheckout = () => {
//     if (!isAuthenticated) {
//       router.push('/auth/login?redirect=/cart');
//     } else {
//       router.push('/checkout');
//     }
//   };

//   if (validItems.length === 0) {
//     return (
//       <section className={styles.section}>
//         <div className={styles.container}>
//           <div className={styles.empty}>
//             <ShoppingCart className={styles.emptyIcon} size={64} />
//             <h2>Your cart is empty</h2>
//             <p>Add some products to get started</p>

//             <Link href="/" className={styles.continueButton}>
//               Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className={styles.section}>
//       <div className={styles.container}>
//         <div className={styles.header}>
//           <h1>Shopping Cart</h1>

//           <button onClick={handleClearCart} className={styles.clearButton}>
//             Clear cart
//           </button>
//         </div>

//         <div className={styles.content}>
//           <div className={styles.itemList}>
//             {validItems.map((item) => (
//               <CartItem key={item.product.id} item={item} />
//             ))}
//           </div>

//           <div className={styles.summary}>
//             <h2>Order summary</h2>

//             <div className={styles.summaryRow}>
//               <span>Subtotal</span>
//               <span>{priceInRupees}</span>
//             </div>

//             <div className={styles.summaryRow}>
//               <span>Shipping</span>
//               <span>Calculate at checkout</span>
//             </div>

//             <hr className={styles.divider} />

//             <div className={styles.summayTotal}>
//               <span>Total</span>
//               <span>{priceInRupees}</span>
//             </div>

//             <button className={styles.checkoutButton} onClick={handleCheckout}>
//               Proceed to checkout
//             </button>

//             <Link className={styles.continueLink} href="/">
//               Continue Shopping
//             </Link>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../../hooks/useCart';
import styles from './cart.module.scss';
import CartItem from './CartItem';
import { useRouter } from 'next/navigation';

export default function CartClient() {
  const { items, clearAllCart, totalPrice } = useCart();
  const router = useRouter();

  const validItems = items.filter((item) => item && item.product);

  const priceInRupees = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(Number(totalPrice));

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      await clearAllCart();
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (validItems.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.empty}>
            <ShoppingCart className={styles.emptyIcon} size={64} />
            <h2>Your cart is empty</h2>
            <p>Add some products to get started</p>

            <Link href="/" className={styles.continueButton}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Shopping Cart</h1>

          <button onClick={handleClearCart} className={styles.clearButton}>
            Clear cart
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.itemList}>
            {validItems.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}
          </div>

          <div className={styles.summary}>
            <h2>Order summary</h2>

            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>{priceInRupees}</span>
            </div>

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculate at checkout</span>
            </div>

            <hr className={styles.divider} />

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>{priceInRupees}</span>
            </div>

            <button className={styles.checkoutButton} onClick={handleCheckout}>
              Proceed to checkout
            </button>

            <Link className={styles.continueLink} href="/">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}