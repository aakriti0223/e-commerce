import ForgotPasswordClient from '@/components/modules/auth/ForgotPasswordClient';

export default function Page() {
  return <ForgotPasswordClient />;
}

export function generateMetadata() {
  return {
    title: 'Forgot Password - Storefront',
    description: 'Reset your Storefront account password',
  };
}