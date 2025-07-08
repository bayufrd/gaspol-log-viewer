// components/LogViewer.js
import React from 'react';
import LogEntry from './LogEntry';

const LogViewer = ({ logs }) => {
    const parseLogLine = (logLine) => {
        const logRegex = /^(?<timestamp>\S+ \S+) \[(?<level>\w+)\]: (?<message>.*)$/;
        const match = logLine.match(logRegex);
        if (match) {
            return {
                timestamp: match.groups.timestamp,
                level: match.groups.level.toLowerCase(), // Menjadi lowercase untuk konsistensi
                message: match.groups.message,
            };
        }
        return null; // Jika tidak cocok, kembalikan null
    };

    return (
        <div>
            {logs.length > 0 ? (
                logs.map((log, index) => {
                    const logObj = parseLogLine(log);
                    if (logObj) {
                        return (
                            <LogEntry 
                                key={index} 
                                timestamp={logObj.timestamp} 
                                level={logObj.level} 
                                message={logObj.message} 
                            />
                        );
                    } else {
                        // Jika entry log tidak valid, tampilkan pesan
                        return (
                            <div key={index}>
                                <div className="text-warning">Log entry tidak valid.</div>
                                <div className="text-danger">{log}</div>
                            </div>
                        );
                    }
                })
            ) : (
                <div className="text-muted">Tidak ada log untuk ditampilkan.</div>
            )}
        </div>
    );
};

export default LogViewer;