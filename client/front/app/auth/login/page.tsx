import LoginClient from '@/components/modules/auth/LoginClient';

export default function Page() {
  return <LoginClient />;
}

export function generateMetadata() {
  return {
    title: 'Login - Storefront',
    description: 'Login to your Storefront account',
  };
}