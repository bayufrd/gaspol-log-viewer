// LogWindowsEntry.js
import React from 'react';

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
    visibleFields
}) => {
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
        <div className={`log-entry p-2 mb-2 rounded ${bg}`}>
            <div className="d-flex justify-content-between align-items-center mb-1" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
                <div>
                    {visibleFields?.created_at && (
                        <small className="text-white-300">{timestamp}</small>
                    )}
                    {visibleFields?.log_level && (
                        <span className={`badge ${text} text-uppercase`}>
                            {level.toUpperCase()}
                        </span>
                    )}
                </div>
                {/* Tombol Salin */}
                <button className="btn btn-outline-light btn-sm" onClick={handleCopy}>
                    Copy
                </button>
            </div>

            <div
                className="log-message"
                style={{
                    fontFamily: "Courier New, Courier, monospace",
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