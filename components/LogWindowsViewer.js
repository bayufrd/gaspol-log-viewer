import React, { useState, useEffect, useRef } from 'react';
import LogEntry from './LogWindowsEntry';

const LogWindowsViewer = ({ windowsLogsData = [], loading, visibleFields }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [updateConfirmData, setUpdateConfirmData] = useState([]);
    const logContainerRef = useRef(null);

    useEffect(() => {
        setFilteredLogs(
            windowsLogsData.filter(log => {
                const logMessage = `${log.id} ${new Date(log.created_at).toLocaleString()} ${log.outlet_id} ${log.exception} ${log.source} ${log.additional_info} ${log.log_level} ${log.log_code} ${log.outlet_name} ${log.message}`;
                return logMessage.toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    }, [windowsLogsData, searchTerm]);

    const fetchUpdateConfirmData = async () => {
        try {
            const baseUri = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${baseUri}/update-confirm`);
            if (!response.ok) throw new Error('Data tidak ditemukan');
            const data = await response.json();
            setUpdateConfirmData(data.data);
        } catch (error) {
            console.error('Error fetching update confirm data:', error);
            setUpdateConfirmData([]);
        }
    };

    useEffect(() => {
        fetchUpdateConfirmData();
        const interval = setInterval(fetchUpdateConfirmData, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            {/* Search */}
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

            {/* Log Entries */}
            <div
                ref={logContainerRef}
                className="log-entries"
                style={{ maxHeight: '300px', overflowY: 'auto' }}
            >
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
                            outlet_id={log.outlet_id}
                            outletName={log.outlet_name}
                            level={log.log_level}
                            message={log.message}
                            logCode={log.log_code}
                            exception={log.exception}
                            source={log.source}
                            additionalInfo={log.additional_info}
                            visibleFields={visibleFields}
                        />
                    ))
                ) : (
                    <div className="alert alert-info bg-dark text-info text-center">
                        Tidak ada log untuk ditampilkan
                    </div>
                )}
            </div>

            {/* Update Confirm Section */}
            <div className="mt-4">
                <h5 className="text-center">Log Update Confirm Client Windows</h5>
                <div className="overflow-auto" style={{ maxHeight: '300px' }}>
                    {updateConfirmData.length > 0 ? (
                        <ul className="list-group">
                            {updateConfirmData.map((update) => {
                                const currentVersion = update.version.split(" UpdaterVer:")[0];
                                const updaterVersion = update.version.split(" UpdaterVer:")[1];
                                const isUpdated = currentVersion.trim() === update.new_version.trim();

                                return (
                                    <li key={update.outlet_id} className="list-group-item bg-dark text-white d-flex align-items-center justify-content-between">
                                        <div>
                                            <h6>{update.outlet_name} (ID: {update.outlet_id})</h6>
                                            <p>Version: {currentVersion}</p>
                                            {updaterVersion && <p>Updater Version: {updaterVersion.trim()}</p>}
                                            <p>New Version: {update.new_version.trim()}</p>
                                            <p>Last Updated: {new Date(update.last_updated).toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <span
                                                style={{
                                                    width: '10px',
                                                    height: '10px',
                                                    borderRadius: '50%',
                                                    backgroundColor: isUpdated ? 'green' : 'yellow',
                                                    display: 'inline-block',
                                                    marginLeft: '10px'
                                                }}
                                            />
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="alert alert-info bg-dark text-info text-center">
                            Tidak ada data update yang tersedia
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogWindowsViewer;
