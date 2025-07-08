import React from 'react';

const LogEntry = ({ timestamp, level, message }) => {
    return (
        <div className="log-entry mb-3 p-2 border rounded" style={{
            backgroundColor: level === 'error' ? '#f8d7da' : '#d4edda',
            borderColor: level === 'error' ? '#f5c6cb' : '#c3e6cb',
        }}>
            <strong>{timestamp}</strong> 
            <span className={`text-${level === 'error' ? 'danger' : 'success'} ms-2`}>{level.toUpperCase()}</span>
            <div className="mt-1">{message}</div>
        </div>
    );
};

export default LogEntry;