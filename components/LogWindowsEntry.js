import React from 'react';

const LogWindowsEntry = ({ timestamp, level, message, logCode, outletName, exception, source, additionalInfo }) => {
    const levelColors = {
        error: {
            bg: 'bg-danger text-white',
            text: 'text-danger'
        },
        warn: {
            bg: 'bg-warning text-dark',
            text: 'text-warning'
        },
        info: {
            bg: 'bg-info text-white',
            text: 'text-info'
        }
    };

    const { bg, text } = levelColors[level] || levelColors['info'];

    return (
        <div className={`log-entry p-2 mb-2 rounded ${bg}`}>
            <div className="d-flex justify-content-between align-items-center mb-1"style={{ fontFamily: 'Courier New, Courier, monospace' }}>
                <small className="text-muted ">{timestamp}</small>
                <span className={`badge ${text} text-uppercase`}>{level.toUpperCase()}</span>
            </div>
            <div className="log-message" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
                {`${logCode} (${outletName}) | ${message}`}</div>
            {exception && <div className="log-description" style={{ fontFamily: 'Courier New, Courier, monospace' }}>Exception: {exception}</div>}
            {source && <div className="log-description" style={{ fontFamily: 'Courier New, Courier, monospace' }}>Source: {source}</div>}
            {additionalInfo && <div className="log-description" style={{ fontFamily: 'Courier New, Courier, monospace' }}>Additional Info: {additionalInfo}</div>}
        </div>
    );
};

export default LogWindowsEntry;