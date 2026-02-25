import React, { useState, useEffect } from 'react';
import LogEntry from './LogEntry';

const LogViewer = ({ logs = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [processedLogs, setProcessedLogs] = useState([]);

    useEffect(() => {
        // Filter log yang valid dan sesuai dengan pencarian
        const validLogs = logs
            .filter(log => typeof log === 'string' && log.trim() !== '')
            .filter(log => {
                // Hindari log HTML atau script
                const isValidLog = !log.includes('<!DOCTYPE') && 
                                   !log.includes('<html>') && 
                                   !log.includes('<script>');
                return isValidLog && log.toLowerCase().includes(searchTerm.toLowerCase());
            });

        setProcessedLogs(validLogs);
    }, [logs, searchTerm]);

    const parseLogLine = (logLine) => {
        // Regex yang lebih fleksibel untuk menangkap log
        const logRegex = /^(?<timestamp>\S+ \S+)?\s*\[?(?<level>[a-zA-Z]+)\]?:?\s*(?<message>.*)$/;
        const match = logLine.match(logRegex);
        
        return match ? {
            timestamp: match.groups.timestamp || 'Tanpa Waktu',
            level: (match.groups.level || 'info').toLowerCase(),
            message: match.groups.message
        } : null;
    };

    return (
        <div className="modern-log-viewer">
            <div className="d-flex align-items-center mb-2" style={{gap: 8}}>
                <span className="bg-dark text-light px-2 py-1 rounded">
                    <i className="bi bi-search"></i>
                </span>
                <input
                    type="text"
                    placeholder="Cari log..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control bg-dark text-light border-0 rounded"
                    style={{maxWidth: 300}}
                />
            </div>
            <div className="log-entries" style={{marginTop: 8}}>
                {processedLogs.length > 0 ? (
                    processedLogs.map((log, index) => {
                        const logObj = parseLogLine(log);
                        return logObj ? (
                            <LogEntry 
                                key={index} 
                                timestamp={logObj.timestamp} 
                                level={logObj.level} 
                                message={logObj.message} 
                            />
                        ) : (
                            <div 
                                key={index} 
                                className="alert alert-warning bg-dark text-warning rounded shadow-sm"
                                style={{fontSize: 13, padding: 8}}
                            >
                                Log tidak valid: {log}
                            </div>
                        );
                    })
                ) : (
                    <div className="alert alert-info bg-dark text-info text-center rounded shadow-sm" style={{fontSize: 13, padding: 8}}>
                        Tidak ada log untuk ditampilkan
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogViewer;
