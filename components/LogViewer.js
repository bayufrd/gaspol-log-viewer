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
                level: match.groups.level.toLowerCase(),
                message: match.groups.message,
            };
        }
        return null; // Return null if it doesn't match the log pattern
    };

    return (
        <table className="table table-bordered">
            <thead>
                <tr>
                    <th>Timestamp</th>
                    <th>Level</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>
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
                            // Invalid log entry
                            return (
                                <tr key={index}>
                                    <td colSpan="3" className="text-danger">{log}</td>
                                </tr>
                            );
                        }
                    })
                ) : (
                    <tr>
                        <td colSpan="3" className="text-muted text-center">Tidak ada log untuk ditampilkan.</td>
                    </tr>
                )}
            </tbody>
        </table>
    );
};

export default LogViewer;