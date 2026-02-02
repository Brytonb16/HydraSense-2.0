import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { farms } from '../data/farms';

const REQUIRED_SOIL_HEADERS = ['zone', 'moisture', 'fertility', 'recommendation'];

const DEFAULT_DRONE_PLACEHOLDER = {
  status: 'Awaiting upload',
  image: '/drone-placeholder.svg',
  summary: 'Drone imagery has not been processed for this zone yet.',
  recommendation: 'Upload the latest drone imagery to receive AI-assisted insights.'
};

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
      recommendation: cells[headerIndexes[3]] || 'No recommendation provided',
      droneImagery: { ...DEFAULT_DRONE_PLACEHOLDER }
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

  const [farmData, setFarmData] = useState(() => farms.map(cloneFarm));
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [uploadStatuses, setUploadStatuses] = useState({});

  const farmOptions = useMemo(() => farmData.map(({ id, name }) => ({ id, name })), [farmData]);
  const displayFarm = useMemo(
    () => farmData.find((farm) => farm.id === selectedFarmId) || null,
    [farmData, selectedFarmId]
  );

  useEffect(() => {
    if (!router.isReady) return;
    if (typeof farmId === 'string' && farmData.some((farm) => farm.id === farmId)) {
      setSelectedFarmId(farmId);
    } else if (farmData.length > 0) {
      setSelectedFarmId(farmData[0].id);
    }
  }, [router.isReady, farmId, farmData]);

  const updateFarmStatus = (farmIdValue, statusUpdate) => {
    setUploadStatuses((current) => {
      const existingStatus = current[farmIdValue] || {};
      return {
        ...current,
        [farmIdValue]: { ...existingStatus, ...statusUpdate }
      };
    });
  };

  const handleFarmChange = (event) => {
    const newFarmId = event.target.value;
    setSelectedFarmId(newFarmId);
    router.replace({ pathname: '/dashboard', query: { farmId: newFarmId } }, undefined, { shallow: true });
  };

  const handleSoilFileUpload = async (farmIdValue, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileContents = await file.text();
      const zones = parseSoilCsv(fileContents);
      setFarmData((current) =>
        current.map((farm) => (farm.id === farmIdValue ? { ...farm, zones } : farm))
      );
      const farm = farmData.find((entry) => entry.id === farmIdValue);
      const cropLabel = farm ? `${farm.crop} data` : 'farm data';
      updateFarmStatus(farmIdValue, {
        error: '',
        success: `Loaded soil sensor CSV from ${file.name}. Insights will be refreshed for ${cropLabel}.`
      });
    } catch (error) {
      updateFarmStatus(farmIdValue, {
        error: error.message || 'Failed to parse soil data file.',
        success: ''
      });
    } finally {
      event.target.value = '';
    }
  };

  const handleDroneFileUpload = (farmIdValue, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    updateFarmStatus(farmIdValue, {
      error: '',
      success: `Drone imagery file ${file.name} received. AI processing is queued for this farm.`
    });
    event.target.value = '';
  };

  const handleReportUpload = (farmIdValue, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const farm = farmData.find((entry) => entry.id === farmIdValue);
    const cropLabel = farm ? farm.crop : 'this crop';
    updateFarmStatus(farmIdValue, {
      error: '',
      success: `Report ${file.name} submitted for OpenAI review of ${cropLabel} performance.`
    });
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
          <h2>Farm Data Intake</h2>
          <p className="section-description">
            Upload data per farm to keep AI feedback aligned to crop type, acreage, and the latest field activity.
          </p>
          <div className="farm-upload-grid">
            {farmData.map((farm) => {
              const status = uploadStatuses[farm.id] || {};
              return (
                <div className="farm-upload-panel" key={farm.id}>
                  <div className="farm-upload-header">
                    <h3>{farm.name}</h3>
                    <p className="farm-upload-meta">{farm.crop} &middot; {farm.acreage} acres</p>
                  </div>
                  <label htmlFor={`${farm.id}-drone-upload`} className="input-label">Upload Drone Data (.tiff, .geojson)</label>
                  <input
                    id={`${farm.id}-drone-upload`}
                    type="file"
                    accept=".tiff,.geojson"
                    onChange={(event) => handleDroneFileUpload(farm.id, event)}
                  />
                  <label htmlFor={`${farm.id}-soil-upload`} className="input-label">Upload Soil Sensor Data (.csv)</label>
                  <input
                    id={`${farm.id}-soil-upload`}
                    type="file"
                    accept=".csv"
                    onChange={(event) => handleSoilFileUpload(farm.id, event)}
                  />
                  <label htmlFor={`${farm.id}-report-upload`} className="input-label">
                    Upload Reports &amp; Lab Results (.pdf, .xls, .xlsx)
                  </label>
                  <input
                    id={`${farm.id}-report-upload`}
                    type="file"
                    accept=".pdf,.xls,.xlsx"
                    onChange={(event) => handleReportUpload(farm.id, event)}
                  />
                  {status.error && <p className="form-feedback error">{status.error}</p>}
                  {status.success && <p className="form-feedback success">{status.success}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section className="zones-grid">
          {displayFarm.zones.map((zone) => {
            const droneImagery = { ...DEFAULT_DRONE_PLACEHOLDER, ...(zone.droneImagery || {}) };

            return (
              <article className="card zone-card" key={zone.id}>
                <h3>{zone.name}</h3>
                <div className="zone-layout">
                  <div className="zone-details">
                    <p><span>Soil Moisture</span><strong>{zone.moisture}</strong></p>
                    <p><span>Fertility</span><strong>{zone.fertility}</strong></p>
                    <p><span>AI Insight</span><strong>{zone.recommendation}</strong></p>
                  </div>
                  <div className="zone-drone">
                    <div className="zone-drone-header">
                      <h4>Drone Imagery Results</h4>
                      <span className={`drone-status drone-status-${droneImagery.status.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                        {droneImagery.status}
                      </span>
                    </div>
                    <div className="drone-image-wrapper">
                      <img src={droneImagery.image} alt={`Drone imagery for ${zone.name}`} />
                    </div>
                    <p className="drone-summary">{droneImagery.summary}</p>
                    <p className="drone-recommendation"><strong>Recommendation:</strong> {droneImagery.recommendation}</p>
                  </div>
                </div>
              </article>
            );
          })}
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
