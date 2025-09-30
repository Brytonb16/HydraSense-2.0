import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { farms } from '../data/farms';

export default function Farms() {
  const router = useRouter();

  const handleSelect = (farmId) => {
    router.push({ pathname: '/dashboard', query: { farmId } });
  };

  const defaultFarmId = farms[0]?.id;

  return (
    <div className="container">
      <Head><title>Select Farm | HydraSense AI</title></Head>

      <header className="header">
        <img src="/logo.svg" alt="HydraSense AI" />
        <nav>
          <Link href="/login">Login</Link>
          {defaultFarmId && <Link href={{ pathname: '/dashboard', query: { farmId: defaultFarmId } }}>Dashboard</Link>}
          <Link href="/settings">Settings</Link>
        </nav>
      </header>

      <section className="page-intro">
        <span className="tag">HydraSense farm network</span>
        <h1>Choose a field to explore real-time intelligence</h1>
        <p>
          Dive into live dashboards tailored to each farm, complete with soil telemetry, drone imagery
          overlays, and AI-powered irrigation priorities. Pick a location below to get started.
        </p>
      </section>

      <section className="farm-list">
        {farms.map((farm) => (
          <button
            key={farm.id}
            type="button"
            className="farm-card"
            onClick={() => handleSelect(farm.id)}
          >
            <span className="tag">{farm.crop}</span>
            <strong>{farm.name}</strong>
            <span>{farm.location}</span>
            <p className="helper-text">
              {farm.zones.length} adaptive zones • {farm.acreage.toLocaleString()} acres in rotation
            </p>
          </button>
        ))}
      </section>

      <footer>
        Need to onboard a new grower? <a href="mailto:hello@hydrasense.ai">Contact our success team</a>
      </footer>
    </div>
  );
}
