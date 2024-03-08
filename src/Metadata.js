import React, { useState, useEffect } from 'react';
import './Metadata.css';
import Navbar from './Components/Navbar';

function App() {
  const [metadata, setMetadata] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/metadata') 
      .then(response => response.json())
      .then(data => {
        setMetadata(data.metadata);
      })
      .catch(error => {
        console.error('Error fetching APK metadata:', error);
      });
  }, []);
  const formatArrayField = (field) => {
    return field ? field.join(', ') : 'N/A';
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>APK Metadata</h1>
        {metadata ? (
          <div className="metadata">
            <div className="metadata-item">
              <span className="label">appName:</span>
              <span className="value">{metadata.appName}</span>
            </div>
            <div className="metadata-item">
              <span className="label">package:</span>
              <span className="value">{metadata.package}</span>
            </div>
            <div className="metadata-item">
              <span className="label">versionCode:</span>
              <span className="value">{metadata.versionCode}</span>
            </div>
            <div className="metadata-item">
              <span className="label">versionName:</span>
              <span className="value">{metadata.versionName}</span>
            </div>
            <div className="metadata-item">
              <span className="label">permissions:</span>
              <span className="value">{formatArrayField(metadata.permissions)}</span>
            </div>
            <div className="metadata-item">
              <span className="label">activities:</span>
              <span className="value">{formatArrayField(metadata.activities)}</span>
            </div>
            <div className="metadata-item">
              <span className="label">services:</span>
              <span className="value">{formatArrayField(metadata.services)}</span>
            </div>
            <div className="metadata-item">
              <span className="label">receivers:</span>
              <span className="value">{formatArrayField(metadata.receivers)}</span>
            </div>
            <div className="metadata-item">
              <span className="label">usesFeatures:</span>
              <span className="value">{formatArrayField(metadata.usesFeatures)}</span>
            </div>
            <div className="metadata-item">
              <span className="label">usesPermissions:</span>
              <span className="value">{formatArrayField(metadata.usesPermissions)}</span>
            </div>
            <div className="metadata-item">
              <span className="label">usesSdk:</span>
              <span className="value">minSdkVersion: {metadata.usesSdk.minSdkVersion}, targetSdkVersion: {metadata.usesSdk.targetSdkVersion}</span>
            </div>
            <div className="metadata-item">
              <span className="label">applicationIcon:</span>
              <span className="value">{metadata.applicationIcon}</span>
            </div>

            {/* Add other labels and values here */}
          </div>
        ) : (
          <p className="loading">Loading metadata...</p>
        )}
      </div>
    </div>
  );
}

export default App;
