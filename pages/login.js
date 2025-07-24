
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const router = useRouter();
  const handleLogin = () => { router.push('/farms'); };

  return (
    <div className="container">
      <Head><title>Login | HydraSense AI</title></Head>
      <div className="header"><img src="/logo.svg" alt="Logo" /></div>
      <div className="card">
        <h1>Login</h1>
        <input type="text" placeholder="Email" /><br />
        <input type="password" placeholder="Password" /><br />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}
