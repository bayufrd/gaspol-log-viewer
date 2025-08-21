import React, { useState, useEffect } from 'react';
import LogEntry from './LogWindowsEntry';

const LogWindowsViewer = ({ windowsLogsData = [], loading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLogs, setFilteredLogs] = useState([]);

    useEffect(() => {
        setFilteredLogs(
            windowsLogsData.filter(log => {
                const logMessage = `${log.id} ${new Date(log.created_at).toLocaleString()} ${log.outlet_id} ${log.exception} ${log.source} ${log.additional_info} ${log.log_level} ${log.log_code} ${log.outlet_name} ${log.message}`;
                
                return logMessage.toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    }, [windowsLogsData, searchTerm]);

    return (
        <div>
            <div className="input-group mb-3">
                <span className="input-group-text bg-dark text-light">
                    <i className="bi bi-search"></i>
                </span>
                <input
                    type="text"
                    placeholder="Cari log..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control bg-dark text-light"
                />
            </div>

            <div className="log-entries">
                {loading && (
                    <div className="text-center">
                        <div className="spinner-border text-light" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                {filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                        <LogEntry 
                            key={log.id} 
                            timestamp={new Date(log.created_at).toLocaleString()} 
                            outlet_id= {log.outlet_id}
                            level={log.log_level.toLowerCase()} 
                            message={log.message} 
                            logCode={log.log_code} 
                            outletName={log.outlet_name} 
                            exception={log.exception} 
                            source={log.source} 
                            additionalInfo={log.additional_info}
                        />
                    ))
                ) : (
                    <div className="alert alert-info bg-dark text-info text-center">
                        Tidak ada log untuk ditampilkan
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogWindowsViewer;