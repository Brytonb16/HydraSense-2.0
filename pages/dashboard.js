import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { farms } from '../data/farms';

const REQUIRED_SOIL_HEADERS = ['zone', 'moisture', 'fertility', 'recommendation'];

const parseSoilCsv = (csvText) => {
  const lines = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new Error('The uploaded file is empty.');
  }

  const headers = lines[0]
    .split(',')
    .map((header) => header.trim().toLowerCase());

  const missingHeaders = REQUIRED_SOIL_HEADERS.filter((header) => !headers.includes(header));
  if (missingHeaders.length > 0) {
    throw new Error(`Missing required column(s): ${missingHeaders.join(', ')}`);
  }

  const headerIndexes = REQUIRED_SOIL_HEADERS.map((header) => headers.indexOf(header));

  const zones = lines.slice(1).map((line, index) => {
    const cells = line.split(',').map((cell) => cell.trim());
    const zoneName = cells[headerIndexes[0]] || `Zone ${index + 1}`;

    return {
      id: `uploaded-zone-${index + 1}`,
      name: zoneName,
      moisture: cells[headerIndexes[1]] || 'Unknown',
      fertility: cells[headerIndexes[2]] || 'Unknown',
      recommendation: cells[headerIndexes[3]] || 'No recommendation provided'
    };
  });

  if (zones.length === 0) {
    throw new Error('No rows of soil data were found.');
  }

  return zones;
};

const cloneFarm = (farm) => JSON.parse(JSON.stringify(farm));

export default function Dashboard() {
  const router = useRouter();
  const { farmId } = router.query;

  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [displayFarm, setDisplayFarm] = useState(null);
  const [soilUploadError, setSoilUploadError] = useState('');
  const [soilUploadSuccess, setSoilUploadSuccess] = useState('');

  const farmOptions = useMemo(() => farms.map(({ id, name }) => ({ id, name })), []);

  useEffect(() => {
    if (!router.isReady) return;
    if (typeof farmId === 'string' && farms.some((farm) => farm.id === farmId)) {
      setSelectedFarmId(farmId);
    } else if (farms.length > 0) {
      setSelectedFarmId(farms[0].id);
    }
  }, [router.isReady, farmId]);

  useEffect(() => {
    if (!selectedFarmId) return;
    const baseFarm = farms.find((farm) => farm.id === selectedFarmId);
    if (!baseFarm) return;
    setDisplayFarm(cloneFarm(baseFarm));
    setSoilUploadError('');
    setSoilUploadSuccess('');
  }, [selectedFarmId]);

  const handleFarmChange = (event) => {
    const newFarmId = event.target.value;
    setSelectedFarmId(newFarmId);
    router.replace({ pathname: '/dashboard', query: { farmId: newFarmId } }, undefined, { shallow: true });
  };

  const handleSoilFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileContents = await file.text();
      const zones = parseSoilCsv(fileContents);
      setDisplayFarm((current) => (current ? { ...current, zones } : current));
      setSoilUploadError('');
      setSoilUploadSuccess(`Loaded soil data from ${file.name}`);
    } catch (error) {
      setSoilUploadError(error.message || 'Failed to parse soil data file.');
      setSoilUploadSuccess('');
    } finally {
      event.target.value = '';
    }
  };

  const handleDroneFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSoilUploadSuccess(`Drone imagery file ${file.name} received. Processing will begin shortly.`);
    setSoilUploadError('');
    event.target.value = '';
  };

  if (!displayFarm) {
    return (
      <div className="container dashboard-page">
        <Head><title>Dashboard | HydraSense AI</title></Head>
        <div className="header"><img src="/logo.svg" alt="Logo" /></div>
        <main className="dashboard-content">
          <section className="card primary-card">
            <h1>Farm Dashboard</h1>
            <p>Loading farm data...</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="container dashboard-page">
      <Head><title>Dashboard | HydraSense AI</title></Head>
      <div className="header"><img src="/logo.svg" alt="Logo" /></div>
      <main className="dashboard-content">
        <section className="card primary-card">
          <h1>{displayFarm.name}</h1>
          <p className="card-subtitle">{displayFarm.location}</p>
          <div className="farm-highlights">
            <div>
              <span className="highlight-label">Primary Crop</span>
              <span className="highlight-value">{displayFarm.crop}</span>
            </div>
            <div>
              <span className="highlight-label">Acreage</span>
              <span className="highlight-value">{displayFarm.acreage} acres</span>
            </div>
          </div>
          <label htmlFor="farm-select" className="input-label">Switch Farm</label>
          <select id="farm-select" value={selectedFarmId} onChange={handleFarmChange}>
            {farmOptions.map((farm) => (
              <option key={farm.id} value={farm.id}>{farm.name}</option>
            ))}
          </select>
        </section>

        <section className="card upload-card">
          <h2>Upload New Data</h2>
          <p className="section-description">Keep your dashboards up-to-date with the latest sensor and drone insights.</p>
          <label htmlFor="drone-upload" className="input-label">Upload Drone Data (.tiff, .geojson)</label>
          <input id="drone-upload" type="file" accept=".tiff,.geojson" onChange={handleDroneFileUpload} />
          <label htmlFor="soil-upload" className="input-label">Upload Soil Sensor Data (.csv)</label>
          <input id="soil-upload" type="file" accept=".csv" onChange={handleSoilFileUpload} />
          {soilUploadError && <p className="form-feedback error">{soilUploadError}</p>}
          {soilUploadSuccess && <p className="form-feedback success">{soilUploadSuccess}</p>}
        </section>

        <section className="zones-grid">
          {displayFarm.zones.map((zone) => (
            <article className="card zone-card" key={zone.id}>
              <h3>{zone.name}</h3>
              <div className="zone-details">
                <p><span>Soil Moisture</span><strong>{zone.moisture}</strong></p>
                <p><span>Fertility</span><strong>{zone.fertility}</strong></p>
                <p><span>AI Recommendation</span><strong>{zone.recommendation}</strong></p>
              </div>
            </article>
          ))}
        </section>

        <section className="card actions-card">
          <div className="actions-content">
            <h2>Settings &amp; Administration</h2>
            <p>Fine-tune alerts, user access, and system integrations for your farm operation.</p>
            <Link href="/settings"><button>Open Settings</button></Link>
          </div>
        </section>
      </main>
    </div>
  );
}
