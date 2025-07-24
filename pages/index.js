
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RedirectToLogin() {
  const router = useRouter();
  useEffect(() => { router.replace('/login'); }, [router]);
  return <p style={{ textAlign: 'center', marginTop: '50px' }}>Redirecting to Login...</p>;
}
