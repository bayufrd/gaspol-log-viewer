import React from 'react';

const LogEntry = ({ timestamp, level, message }) => {
    const levelColors = {
        'error': {
            bg: 'bg-danger text-white',
            text: 'text-danger'
        },
        'warn': {
            bg: 'bg-warning text-dark',
            text: 'text-warning'
        },
        'info': {
            bg: 'bg-info text-white',
            text: 'text-info'
        },
        'debug': {
            bg: 'bg-secondary text-light',
            text: 'text-secondary'
        }
    };

    const { bg, text } = levelColors[level] || levelColors['debug'];

    return (
        <div className={`log-entry p-2 mb-2 rounded ${bg}`}>
            <div className="d-flex justify-content-between align-items-center mb-1"style={{ fontFamily: 'Courier New, Courier, monospace' }}>
                <small className="text-muted">{timestamp}</small>
                <span className={`badge ${text} text-uppercase`}>{level}</span>
            </div>
            <div className="log-message" style={{ fontFamily: 'Courier New, Courier, monospace' }}>{message}</div>
        </div>
    );
};

export default LogEntry;
