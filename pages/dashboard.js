
import Link from 'next/link';
import Head from 'next/head';

export default function Dashboard() {
  const zones = [
    { id: 1, name: 'Zone 1', moisture: 'Optimal', fert: 'Stable', rec: 'Irrigate 0.8"' },
    { id: 2, name: 'Zone 2', moisture: 'Low', fert: 'Low Nitrogen', rec: 'Irrigate 1.2" + Fertilize N' },
    { id: 3, name: 'Zone 3', moisture: 'Critical', fert: 'Very Low K', rec: 'Irrigate 1.5" + Fertilize K' }
  ];

  return (
    <div className="container">
      <Head><title>Dashboard | HydraSense AI</title></Head>
      <div className="header"><img src="/logo.svg" alt="Logo" /></div>
      <div className="card">
        <h1>Farm Dashboard</h1>
        <input type="file" accept=".tiff,.geojson" /><label> Upload Drone Data</label><br />
        <input type="file" accept=".csv" /><label> Upload Soil Sensor Data</label>
      </div>
      {zones.map(zone => (
        <div className="card" key={zone.id}>
          <h2>{zone.name}</h2>
          <p>Soil Moisture: {zone.moisture}</p>
          <p>Fertility: {zone.fert}</p>
          <p>AI Rec: {zone.rec}</p>
        </div>
      ))}
      <div className="card"><Link href="/settings"><button>Settings</button></Link></div>
    </div>
  );
}
