// UpdateConfirmCard.js
import React from 'react';

function compareVersions(v1, v2) {
  if (!v1 || !v2) return false;
  const a = v1.trim().split('.').map(Number);
  const b = v2.trim().split('.').map(Number);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const numA = a[i] || 0;
    const numB = b[i] || 0;
    if (numA > numB) return true;
    if (numA < numB) return false;
  }
  const intA = parseInt(v1.replace(/\.|\s/g, ''), 10);
  const intB = parseInt(v2.replace(/\.|\s/g, ''), 10);
  return intA >= intB;
}

export default function UpdateConfirmCard({ update, remoteVersion }) {
  const currentVersion = update.version.split(' UpdaterVer:')[0];
  const updaterVersion = update.version.split(' UpdaterVer:')[1];
  const isUpdated = remoteVersion && compareVersions(currentVersion, remoteVersion);

  return (
    <div
      className="surface-card"
      style={{
        minWidth: 0,
        minHeight: 190,
        padding: 18,
        borderRadius: 20,
        border: `1px solid ${isUpdated ? 'rgba(34, 197, 94, 0.34)' : 'rgba(245, 158, 11, 0.34)'}`,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        background: isUpdated
          ? 'linear-gradient(180deg, rgba(6, 78, 59, 0.42) 0%, rgba(5, 46, 22, 0.88) 38%, rgba(15, 23, 42, 0.98) 100%)'
          : 'linear-gradient(180deg, rgba(120, 53, 15, 0.42) 0%, rgba(113, 63, 18, 0.86) 38%, rgba(15, 23, 42, 0.98) 100%)',
      }}
    >
      <div className="d-flex justify-content-between align-items-start" style={{ gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6, color: '#f8fafc' }}>
            {update.outlet_name}
          </div>
          <div style={{ color: '#94a3b8', fontSize: 12 }}>
            Outlet ID {update.outlet_id}
          </div>
        </div>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 10px',
            borderRadius: 999,
            fontSize: 10,
            lineHeight: 1,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            background: isUpdated ? 'rgba(34, 197, 94, 0.14)' : 'rgba(245, 158, 11, 0.14)',
            border: `1px solid ${isUpdated ? 'rgba(34, 197, 94, 0.28)' : 'rgba(245, 158, 11, 0.28)'}`,
            color: isUpdated ? '#86efac' : '#fcd34d',
          }}
        >
          <i className={`bi ${isUpdated ? 'bi-check-circle-fill' : 'bi-arrow-repeat'}`}></i>
          {isUpdated ? 'Updated' : 'Needs sync'}
        </span>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        <div>
          <div style={{ color: '#94a3b8', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Installed Version</div>
          <div style={{ color: '#f8fafc', fontWeight: 700, marginTop: 4 }}>{currentVersion}</div>
        </div>
        {updaterVersion && (
          <div>
            <div style={{ color: '#94a3b8', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Updater Version</div>
            <div style={{ color: '#dbeafe', fontWeight: 600, marginTop: 4 }}>{updaterVersion.trim()}</div>
          </div>
        )}
        <div>
          <div style={{ color: '#94a3b8', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Remote Target</div>
          <div style={{ color: isUpdated ? '#86efac' : '#fcd34d', fontWeight: 700, marginTop: 4 }}>{(update.new_version || '').trim() || remoteVersion}</div>
        </div>
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid rgba(148, 163, 184, 0.12)' }}>
        <div style={{ color: '#94a3b8', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Last Updated</div>
        <div style={{ color: '#cbd5e1', fontSize: 13, marginTop: 4 }}>
          {new Date(update.last_updated).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
