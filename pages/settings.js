
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Settings() {
  const [language, setLanguage] = useState('en');

  return (
    <div className="container">
      <Head><title>Settings | HydraSense AI</title></Head>

      <header className="header">
        <img src="/logo.svg" alt="HydraSense AI" />
        <nav>
          <Link href="/farms">Farms</Link>
          <Link href={{ pathname: '/dashboard', query: { farmId: 'evergreen-valley' } }}>Dashboard</Link>
        </nav>
      </header>

      <section className="page-intro">
        <span className="tag">Control center</span>
        <h1>Fine-tune your HydraSense experience</h1>
        <p>
          Manage localization, alerting, and collaboration preferences for your team. Settings update
          instantly across every connected farm dashboard.
        </p>
      </section>

      <section className="settings-layout">
        <div className="card">
          <h2>Localization</h2>
          <p className="helper-text">
            Choose the language used across dashboards, downloadable reports, and notification emails.
          </p>
          <label htmlFor="language">Display language</label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
          <p className="status status--success">Active: {language === 'en' ? 'English' : 'Español'}</p>
        </div>

        <div className="card card--surface">
          <h2>What&apos;s next?</h2>
          <p className="helper-text">We&apos;re expanding settings to cover more of your workflow.</p>
          <ul className="list-muted">
            <li>Custom alert thresholds per management zone</li>
            <li>Role-based access for agronomy partners</li>
            <li>API keys for streaming data into third-party tools</li>
          </ul>
        </div>
      </section>

      <footer>
        Looking for something else? <a href="mailto:support@hydrasense.ai">Reach our support engineers</a>.
      </footer>
    </div>
  );
}
