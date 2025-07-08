// components/LogViewer.js
import React from 'react';
import LogEntry from './LogEntry';

const LogViewer = ({ logs }) => {
    return (
        <div>
            {logs.length > 0 ? (
                logs.map((log, index) => {
                    try {
                        const logObj = JSON.parse(log); // Parse log JSON
                        return (
                            <LogEntry 
                                key={index} 
                                timestamp={logObj.timestamp} 
                                level={logObj.level} 
                                message={logObj.message} 
                            />
                        );
                    } catch (error) {
                        // Jika error saat parsing JSON, tampilkan pesan yang sesuai
                        return (
                            <div key={index}>
                                <div className="text-warning">Log entry tidak valid.</div>
                                <div className="text-danger">{log}</div> {/* Tampilkan log asli */}
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