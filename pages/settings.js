
import { useState } from 'react';

export default function Settings() {
  const [language, setLanguage] = useState('en');

  return (
    <div className="container">
      <h2>Settings</h2>
      <div className="card">
        <label htmlFor="language">Language:</label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
        <p style={{ marginTop: '10px' }}>
          Selected: <strong>{language === 'en' ? 'English' : 'Español'}</strong>
        </p>
      </div>
    </div>
  );
}
