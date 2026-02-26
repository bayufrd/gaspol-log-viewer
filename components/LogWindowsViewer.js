import React, { useState, useEffect, useRef } from 'react';
import LogEntry from './LogWindowsEntry';

const LogWindowsViewer = ({ windowsLogsData = [], loading, visibleFields, onlyUpdateConfirm = false }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [updateConfirmData, setUpdateConfirmData] = useState([]);
    const [remoteVersion, setRemoteVersion] = useState(null);
    const logContainerRef = useRef(null);

    useEffect(() => {
        // Filter first based on searchTerm
        const filtered = windowsLogsData.filter(log => {
            const logMessage = `${log.id} ${new Date(log.created_at).toLocaleString()} ${log.outlet_id} ${log.exception} ${log.source} ${log.additional_info} ${log.log_level} ${log.log_code} ${log.outlet_name} ${log.message}`;
            return logMessage.toLowerCase().includes(searchTerm.toLowerCase());
        });

        // Group ALL identical logs globally (not only consecutive).
        // Key fields: outlet_id, message, exception, source, additional_info
        const makeKey = (l) => `${l.outlet_id}||${l.message}||${l.exception}||${l.source}||${l.additional_info}`;
        const groupsMap = new Map();
        for (const log of filtered) {
            const key = makeKey(log);
            if (!groupsMap.has(key)) groupsMap.set(key, []);
            groupsMap.get(key).push(log);
        }

        // Build groups array with representative being the most recent log
        const groups = [];
        for (const [key, items] of groupsMap.entries()) {
            // find most recent item by created_at
            const sorted = [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            const representative = sorted[0];
            groups.push({
                _groupKey: key,
                mergedCount: items.length,
                representativeTimestamp: representative.created_at,
                representative,
                mergedItems: sorted // most recent first
            });
        }

        // Sort groups by most recent timestamp descending so latest groups show first
        groups.sort((a, b) => new Date(b.representativeTimestamp) - new Date(a.representativeTimestamp));

        setFilteredLogs(groups);
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
                    filteredLogs.map((group, idx) => {
                        const rep = group.representative || {};
                        return (
                            <LogEntry
                                key={`${group._groupKey || idx}`}
                                timestamp={new Date(group.representativeTimestamp || rep.created_at).toLocaleString()}
                                outlet_id={rep.outlet_id}
                                outletName={rep.outlet_name}
                                level={rep.log_level}
                                message={rep.message}
                                logCode={rep.log_code}
                                exception={rep.exception}
                                source={rep.source}
                                additionalInfo={rep.additional_info}
                                visibleFields={visibleFields}
                                mergedCount={group.mergedCount || 1}
                                mergedItems={group.mergedItems || [rep]}
                            />
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

export default LogWindowsViewer;
