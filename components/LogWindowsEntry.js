// LogWindowsEntry.js
import React, { useState } from 'react';

const LogWindowsEntry = ({
    timestamp,
    outlet_id,
    outletName,
    level,
    message,
    logCode,
    exception,
    source,
    additionalInfo,
    visibleFields,
    mergedCount = 1,
    mergedItems = [],
}) => {
    const [expanded, setExpanded] = useState(false);
    const levelColors = {
        error: { bg: 'bg-black', text: 'text-danger' },
        warn: { bg: 'bg-warning', text: 'text-dark' },
        info: { bg: 'bg-dark', text: 'text-success' }
    };

    const { bg, text } = levelColors[level] || levelColors['info'];

    const handleCopy = () => {
        const logText = `
            ${visibleFields?.log_level ? `${level.toUpperCase()} [${logCode}]` : ''}
            ${visibleFields?.outlet_id ? `⚠️ Outlet ID: ${outlet_id} (${outletName})` : ''}
            ${visibleFields?.message ? `⚠️ msg: ${message}` : ''}
            ${visibleFields?.exception ? `⚠️ ex: ${exception}` : ''}
            ${visibleFields?.source ? `⚠️ sc: ${source}` : ''}
            ${visibleFields?.additional_info ? `⚠️ adtinfo: ${additionalInfo}` : ''}
        `.trim();

        navigator.clipboard.writeText(logText)
            .then(() => alert('Log entry copied to clipboard!'))
            .catch(err => console.error('Error copying log entry:', err));
    };

    return (
        <div className={`log-entry p-2 mb-2 rounded shadow-sm ${bg}`} style={{border: 'none', fontSize: 13}}>
            <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontFamily: 'GeistMono, Courier New, Courier, monospace' }}>
                <div>
                    {visibleFields?.created_at && (
                        <small className="text-white-300">{timestamp}</small>
                    )}
                    {visibleFields?.log_level && (
                        <span className={`badge ${text} text-uppercase`} style={{fontSize: 11}}>
                            {level.toUpperCase()}
                        </span>
                    )}
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    {mergedCount > 1 && (
                        <button
                            className="btn btn-outline-light btn-sm"
                            style={{fontSize: 11, padding: '2px 8px', minWidth: 30}}
                            onClick={() => setExpanded((v) => !v)}
                            aria-label={expanded ? 'Hide merged items' : 'Show merged items'}
                        >
                            {expanded ? '▾' : '▸'}
                        </button>
                    )}
                    {mergedCount > 1 && (
                        <span className="badge bg-secondary" style={{fontSize: 11}}>
                            {mergedCount} logs merged
                        </span>
                    )}
                    {/* Tombol Salin */}
                    <button className="btn btn-outline-light btn-sm" style={{fontSize: 11, padding: '2px 8px'}} onClick={handleCopy}>
                        Copy
                    </button>
                </div>
            </div>
            {expanded && mergedItems && mergedItems.length > 1 && (
                <div className="merged-items-list mt-2" style={{fontSize: 12, color: '#cbd5e1', paddingLeft: 8}}>
                    {mergedItems.map((it, i) => (
                        <div key={`${it.id || i}_${i}`} style={{padding: '4px 0', borderBottom: '1px dashed rgba(255,255,255,0.04)'}}>
                            <div style={{display: 'flex', justifyContent: 'space-between', gap: 8}}>
                                <div style={{fontFamily: 'GeistMono, Courier New, monospace'}}>
                                    {visibleFields?.created_at ? new Date(it.created_at).toLocaleString() : ''}
                                    {visibleFields?.source && ` — ${it.source || ''}`}
                                </div>
                                <div>
                                    {/* optional per-item small copy could go here */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div
                className="log-message"
                style={{
                    fontFamily: "GeistMono, Courier New, Courier, monospace",
                    whiteSpace: "pre-line",
                }}
            >
                {visibleFields?.log_level && `${level.toUpperCase()}[${logCode}]\n`}
                {visibleFields?.outlet_id && `⚠️ Outlet ID : ${outlet_id} (${outletName})\n`}
                {visibleFields?.message && `⚠️ msg: ${message}\n`}
                {visibleFields?.exception && `⚠️ ex: ${exception}\n`}
                {visibleFields?.source && `⚠️ sc: ${source}\n`}
                {visibleFields?.additional_info && `⚠️ adtinfo: ${additionalInfo}\n`}
            </div>
        </div>
    );
};

export default LogWindowsEntry;