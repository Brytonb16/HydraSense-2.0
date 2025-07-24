
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Farms() {
  const router = useRouter();
  const handleSelect = () => { router.push('/dashboard'); };

  return (
    <div className="container">
      <Head><title>Select Farm | HydraSense AI</title></Head>
      <div className="header"><img src="/logo.svg" alt="Logo" /></div>
      <div className="card">
        <h1>Select Your Farm</h1>
        <button onClick={handleSelect}>Almond Grove 01</button>
      </div>
    </div>
  );
}
