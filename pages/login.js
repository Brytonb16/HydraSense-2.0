
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const handleLogin = () => { router.push('/farms'); };

  return (
    <div className="container">
      <Head><title>Login | HydraSense AI</title></Head>

      <header className="header">
        <img src="/logo.svg" alt="HydraSense AI" />
        <nav>
          <Link href="/farms">Farms</Link>
          <Link href="/settings">Settings</Link>
        </nav>
      </header>

      <section className="page-intro">
        <span className="tag">Welcome back</span>
        <h1>Access your precision irrigation intelligence</h1>
        <p>
          Sign in to unlock live dashboards, AI recommendations, and historical analytics for every
          field you manage with HydraSense AI.
        </p>
      </section>

      <section className="card">
        <h2>Sign in to continue</h2>
        <div className="card-grid">
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" placeholder="you@farm.co" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="••••••••" />
          </div>
        </div>
        <button onClick={handleLogin}>Login</button>
        <p className="helper-text">
          Need an account? <a className="subtle-link" href="mailto:hello@hydrasense.ai">Talk with our onboarding team</a>.
        </p>
      </section>

      <footer>
        By continuing you agree to the HydraSense <a href="#">privacy policy</a> and <a href="#">terms</a>.
      </footer>
    </div>
  );
}
