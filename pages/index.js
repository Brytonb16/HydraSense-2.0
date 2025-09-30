
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function RedirectToLogin() {
  const router = useRouter();
  useEffect(() => { router.replace('/login'); }, [router]);

  return (
    <div className="container">
      <Head><title>HydraSense AI</title></Head>
      <header className="header">
        <img src="/logo.svg" alt="HydraSense AI" />
        <nav>
          <Link href="/login">Login</Link>
          <Link href="/farms">Farms</Link>
        </nav>
      </header>
      <section className="page-intro">
        <span className="tag">Loading console</span>
        <h1>HydraSense AI is preparing your control center</h1>
        <p>We&apos;re redirecting you to the secure login experience. This only takes a moment.</p>
      </section>
      <section className="card">
        <h2>Redirecting to Login...</h2>
        <p className="helper-text">If nothing happens, continue manually below.</p>
        <Link className="button button--ghost" href="/login">Go to login</Link>
      </section>
    </div>
  );
}
