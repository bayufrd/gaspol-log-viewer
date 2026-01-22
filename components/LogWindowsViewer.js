import React, { useState, useEffect, useRef } from 'react';
import LogEntry from './LogWindowsEntry';

const LogWindowsViewer = ({ windowsLogsData = [], loading, visibleFields, onlyUpdateConfirm = false }) => {
    const [latestVersion, setLatestVersion] = useState(null);
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

    useEffect(() => {
        async function fetchLatestVersion() {
            try {
                const res = await fetch('https://gaspollmanagementcenter.com/server/version.txt');
                const txt = await res.text();
                setLatestVersion(txt.trim());
            } catch (err) {
                setLatestVersion(null);
            }
        }
        fetchLatestVersion();
    }, []);

    // Only green if new_version === latestVersion (after trim)
    function isVersionUpToDate(newVersion, latestVersion) {
        if (!newVersion || !latestVersion) return false;
        return newVersion.trim() === latestVersion.trim();
    }

    if (onlyUpdateConfirm) {
        return (
            <div className="mt-2">
                <div className="overflow-auto" style={{ maxHeight: '400px' }}>
                    {updateConfirmData.length > 0 ? (
                        <ul className="list-group">
                            {updateConfirmData.map((update) => {
                                const currentVersion = update.version.split(" UpdaterVer:")[0];
                                const updaterVersion = update.version.split(" UpdaterVer:")[1];
                                const newVersion = update.new_version.trim();
                                // Compare with latestVersion from web
                                const isUpdated = latestVersion ? isVersionUpToDate(newVersion, latestVersion) : (currentVersion.trim() === newVersion);
                                console.log('[DEBUG] Outlet:', update.outlet_name, '| newVersion:', JSON.stringify(newVersion), '| latestVersion:', JSON.stringify(latestVersion), '| isUpdated:', isUpdated);
                                return (
                                    <li key={update.outlet_id} className="list-group-item bg-dark text-white d-flex align-items-center justify-content-between rounded shadow-sm" style={{marginBottom: 8}}>
                                        <div>
                                            <h6>{update.outlet_name} (ID: {update.outlet_id})</h6>
                                            <p>Version: {currentVersion}</p>
                                            {updaterVersion && <p>Updater Version: {updaterVersion.trim()}</p>}
                                            <p>New Version: {newVersion}</p>
                                            <p>Last Updated: {new Date(update.last_updated).toLocaleString()}</p>
                                            {latestVersion && <p>Latest Version (server): <b>{latestVersion}</b></p>}
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
                        <div className="alert alert-info bg-dark text-info text-center rounded shadow-sm" style={{fontSize: 13, padding: 8}}>
                            Tidak ada data update yang tersedia
                        </div>
                    )}
                </div>
            </div>
        );
    }
    return (
        <div className="modern-log-windows-viewer">
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
            <div
                ref={logContainerRef}
                className="log-entries"
                style={{ maxHeight: '300px', overflowY: 'auto', marginTop: 8 }}
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
                    <div className="alert alert-info bg-dark text-info text-center rounded shadow-sm" style={{fontSize: 13, padding: 8}}>
                        Tidak ada log untuk ditampilkan
                    </div>
                )}
            </div>
        </div>
    );
};

export default LogWindowsViewer;
