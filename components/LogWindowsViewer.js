import React, { useState, useEffect, useRef } from 'react';
import LogEntry from './LogWindowsEntry';

const LogWindowsViewer = ({ windowsLogsData = [], loading, visibleFields, onlyUpdateConfirm = false }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [updateConfirmData, setUpdateConfirmData] = useState([]);
    const [remoteVersion, setRemoteVersion] = useState(null);
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

    // Fetch remote version from local proxy endpoint on first load
    useEffect(() => {
        const fetchRemoteVersion = async () => {
            try {
                const response = await fetch('/api/version-proxy');
                if (!response.ok) throw new Error('Failed to fetch remote version');
                const text = await response.text();
                setRemoteVersion(text.trim());
            } catch (error) {
                console.error('Error fetching remote version:', error);
                setRemoteVersion(null);
            }
        };
        fetchRemoteVersion();
    }, []);

    if (onlyUpdateConfirm) {
        const UpdateConfirmCard = require('./UpdateConfirmCard').default;
        // Sort by outlet_id ascending
        const sortedData = [...updateConfirmData].sort((a, b) => Number(a.outlet_id) - Number(b.outlet_id));
        if (!remoteVersion) {
            return (
                <div className="mt-2" style={{flex: 1, minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column'}}>
                    <div className="alert alert-info bg-dark text-info text-center rounded shadow-sm" style={{fontSize: 13, padding: 8}}>
                        Mengambil versi terbaru dari server...
                    </div>
                </div>
            );
        }
        return (
            <div className="mt-2" style={{flex: 1, minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column'}}>
                <div className="overflow-auto" style={{
                    flex: 1,
                    minHeight: 0,
                    height: '100%',
                    background: '#23272e',
                    border: '2px solid #111',
                    borderRadius: 12,
                    boxShadow: '0 2px 12px rgba(56,189,248,0.08)',
                    padding: 8,
                    margin: 2,
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    {sortedData.length > 0 ? (
                        <div
                            className="update-confirm-cards-grid"
                            style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                columnGap: 12,
                                rowGap: 6,
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                width: '100%',
                                height: '100%',
                                overflow: 'auto',
                                padding: 4,
                                background: 'transparent',
                            }}
                        >
                            {sortedData.map((update) => (
                                <UpdateConfirmCard key={update.outlet_id} update={update} remoteVersion={remoteVersion} />
                            ))}
                        </div>
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
        <div className="modern-log-windows-viewer" style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
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
                style={{ flex: 1, minHeight: 0, overflowY: 'auto', marginTop: 8, display: 'flex', flexDirection: 'column' }}
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
