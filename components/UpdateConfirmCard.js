// UpdateConfirmCard.js
import React from 'react';

export default function UpdateConfirmCard({ update }) {
  const currentVersion = update.version.split(" UpdaterVer:")[0];
  const updaterVersion = update.version.split(" UpdaterVer:")[1];
  const isUpdated = currentVersion.trim() === update.new_version.trim();
  return (
    <div
      className="update-confirm-card bg-dark text-white rounded shadow-sm d-flex flex-column justify-content-between"
      style={{
        minWidth: 260,
        maxWidth: 340,
        minHeight: 140,
        maxHeight: 180,
        margin: 2,
        padding: 16,
        border: isUpdated ? '2px solid #22c55e' : '2px solid #facc15',
        boxSizing: 'border-box',
        flex: 1,
        display: 'flex',
      }}
    >
      <div style={{fontWeight: 600, fontSize: 16, marginBottom: 4, color: isUpdated ? '#22c55e' : '#facc15'}}>
        {update.outlet_name} <span style={{fontWeight: 400, fontSize: 13}}>(ID: {update.outlet_id})</span>
      </div>
      <div style={{fontSize: 13, marginBottom: 2}}>
        <div>Version: <b>{currentVersion}</b></div>
        {updaterVersion && <div>Updater Version: <b>{updaterVersion.trim()}</b></div>}
        <div>New Version: <b>{update.new_version.trim()}</b></div>
        <div>Last Updated: <span style={{fontWeight: 400}}>{new Date(update.last_updated).toLocaleString()}</span></div>
      </div>
      <div style={{alignSelf: 'flex-end'}}>
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: isUpdated ? '#22c55e' : '#facc15',
            display: 'inline-block',
            marginLeft: 2,
            border: '1.5px solid #fff',
          }}
        />
      </div>
    </div>
  );
}
