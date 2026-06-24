import RegisterClient from '@/components/modules/auth/RegisterClient';

export default function Page() {
  return <RegisterClient />;
}

export function generateMetadata() {
  return {
    title: 'Create Account - Storefront',
    description: 'Create your Storefront account',
  };
}