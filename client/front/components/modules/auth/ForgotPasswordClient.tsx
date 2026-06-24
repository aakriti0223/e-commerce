'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import styles from './login.module.scss';

export default function ForgotPasswordClient() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgotPassword = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage(
      'If this email is registered, password reset instructions will be sent.'
    );
  };

  return (
    <section className={styles.section}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/" className={styles.logo}>
            STOREFRONT
          </Link>

          <h1>Forgot Password</h1>
          <p>Enter your email to reset your password.</p>
        </div>

        <form onSubmit={handleForgotPassword} className={styles.form}>
          {message && <div className={styles.success}>{message}</div>}

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Send Reset Link
          </button>
        </form>

        <p className={styles.footerText}>
          Remember your password? <Link href="/auth/login">Login</Link>
        </p>
      </div>
    </section>
  );
}