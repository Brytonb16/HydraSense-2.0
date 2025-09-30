import { useRouter } from 'next/router';
import Head from 'next/head';
import { farms } from '../data/farms';

export default function Farms() {
  const router = useRouter();

  const handleSelect = (farmId) => {
    router.push({ pathname: '/dashboard', query: { farmId } });
  };

  return (
    <div className="container">
      <Head><title>Select Farm | HydraSense AI</title></Head>
      <div className="header"><img src="/logo.svg" alt="Logo" /></div>
      <div className="card">
        <h1>Select Your Farm</h1>
        <p style={{ marginBottom: '1.5rem' }}>Choose a farm to load its latest insights and sensor data.</p>
        {farms.map((farm) => (
          <button
            key={farm.id}
            onClick={() => handleSelect(farm.id)}
            style={{ marginBottom: '0.75rem' }}
          >
            {farm.name} &mdash; {farm.location}
          </button>
        ))}
      </div>
    </div>
  );
}
