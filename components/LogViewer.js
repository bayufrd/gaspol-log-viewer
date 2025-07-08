import React, { useState } from 'react';
import LogEntry from './LogEntry';

const LogViewer = ({ logs }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const parseLogLine = (logLine) => {
        const logRegex = /^(?<timestamp>\S+ \S+) \[(?<level>[a-zA-Z]+)\]: (?<message>.*)$/;
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

    const filteredLogs = logs.filter(log =>
        log.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Cari log..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control mb-3"
            />
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>Level</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLogs.length > 0 ? (
                        filteredLogs.map((log, index) => {
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
        </div>
    );
};

export default LogViewer;