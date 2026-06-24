'use client';

import React from 'react';
import styles from './header.module.scss';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const router = useRouter();

  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const { totalItems } = useCart();

  const handleDashboardClick = () => {
    if (user && user.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/user');
    }
  };

  const handleLogoutClick = async () => {
    await logout();
  };

  const handleLoginClick = () => {
    router.push('/auth/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          STOREFRONT
        </Link>

        <div className={styles.actions}>
          <Link href="/cart" className={styles.cartButton}>
            <ShoppingCart size={22} strokeWidth={2} />

            {totalItems > 0 && (
              <span className={styles.badge}>{totalItems}</span>
            )}
          </Link>

          <Link href="/user/orders" className={styles.ordersButton}>
            My Orders
          </Link>

          {isAuthenticated ? (
            <>
              <button
                type="button"
                className={styles.dashboardButton}
                onClick={handleDashboardClick}
              >
                <LayoutDashboard size={20} />
              </button>

              <button
                type="button"
                onClick={handleLogoutClick}
                className={styles.logoutButton}
                disabled={isLoading}
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </>
          ) : (
            <button
              type="button"
              className={styles.loginButton}
              onClick={handleLoginClick}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}