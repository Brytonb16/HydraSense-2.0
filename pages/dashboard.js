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

  const targetFarmId = selectedFarmId || farms[0]?.id || '';
  const activeRecommendation = displayFarm?.zones?.[0]?.recommendation || 'Monitor conditions and await new telemetry.';
  const zoneCount = displayFarm?.zones?.length || 0;

  if (!displayFarm) {
    return (
      <div className="container">
        <Head><title>Dashboard | HydraSense AI</title></Head>
        <header className="header">
          <img src="/logo.svg" alt="Logo" />
        </header>
        <div className="card">
          <h1>Farm Dashboard</h1>
          <p>Loading farm data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Head><title>Dashboard | HydraSense AI</title></Head>

      <header className="header">
        <img src="/logo.svg" alt="HydraSense AI" />
        <nav>
          <Link href="/farms">Farms</Link>
          <Link href={{ pathname: '/dashboard', query: { farmId: targetFarmId } }}>Dashboard</Link>
          <Link href="/settings">Settings</Link>
        </nav>
      </header>

      <section className="page-intro">
        <span className="tag">Live agronomic telemetry</span>
        <h1>Precision insights for {displayFarm.name}</h1>
        <p>
          Stay ahead of changing field conditions with live soil telemetry, curated drone uploads,
          and AI-backed recommendations designed to maximize your yields season after season.
        </p>
      </section>

      <section className="card card--surface">
        <h2>Farm Overview</h2>
        <div className="card-grid">
          <div>
            <p className="panel-title">Primary Crop</p>
            <h3>{displayFarm.crop}</h3>
            <p className="helper-text">Optimized nutrient plan tailored to this crop&apos;s current growth stage.</p>
          </div>
          <div>
            <p className="panel-title">Acreage</p>
            <h3>{displayFarm.acreage.toLocaleString()} acres</h3>
            <p className="helper-text">Monitoring {zoneCount} management zones with continuous sensor updates.</p>
          </div>
          <div>
            <p className="panel-title">Location</p>
            <h3>{displayFarm.location}</h3>
            <p className="helper-text">Regional forecasts and irrigation models synced to this environment.</p>
          </div>
          <div>
            <p className="panel-title">Next Action</p>
            <h3>{activeRecommendation}</h3>
            <p className="helper-text">Shared automatically with collaborators subscribed to this farm.</p>
          </div>
        </div>
        <div className="pill-select">
          <label htmlFor="farm-select">Switch Farm</label>
          <select id="farm-select" value={selectedFarmId} onChange={handleFarmChange}>
            {farmOptions.map((farm) => (
              <option key={farm.id} value={farm.id}>{farm.name}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="card">
        <h2>Upload New Data</h2>
        <p className="helper-text">
          Refresh analytics instantly by uploading fresh drone imagery or soil sensor exports. Files
          are scanned for anomalies and merged with the live data stream.
        </p>
        <div className="upload-actions">
          <div>
            <label htmlFor="drone-upload">Drone Imagery (.tiff, .geojson)</label>
            <input id="drone-upload" type="file" accept=".tiff,.geojson" onChange={handleDroneFileUpload} />
          </div>
          <div>
            <label htmlFor="soil-upload">Soil Sensor Data (.csv)</label>
            <input id="soil-upload" type="file" accept=".csv" onChange={handleSoilFileUpload} />
          </div>
        </div>
        {soilUploadError && <p className="status status--error">{soilUploadError}</p>}
        {soilUploadSuccess && <p className="status status--success">{soilUploadSuccess}</p>}
      </section>

      <section>
        <div className="page-intro" style={{ color: 'inherit' }}>
          <span className="tag">Management zones</span>
          <h2 style={{ color: 'white', marginTop: '8px' }}>Sensor pulse &amp; AI recommendations</h2>
          <p>
            Each zone card blends the latest soil metrics with guidance from HydraSense AI to help you
            prioritize irrigation, nutrition, and scouting activities across the farm.
          </p>
        </div>
        <div className="zones-grid" style={{ marginTop: '24px' }}>
          {displayFarm.zones.map((zone) => (
            <div className="card zone-card" key={zone.id}>
              <h3>{zone.name}</h3>
              <div className="zone-metric">
                <strong>Soil Moisture</strong>
                <span>{zone.moisture}</span>
              </div>
              <div className="zone-metric">
                <strong>Fertility</strong>
                <span>{zone.fertility}</span>
              </div>
              <div className="divider" />
              <div className="zone-metric">
                <strong>AI Recommendation</strong>
                <span>{zone.recommendation}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer>
        Need to adjust your alerting thresholds? <Link className="subtle-link" href="/settings">Open farm settings</Link>
      </footer>
    </div>
  );
}
