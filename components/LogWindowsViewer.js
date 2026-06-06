import React, { useState, useEffect, useRef } from 'react';
import LogEntry from './LogWindowsEntry';

const LogWindowsViewer = ({ windowsLogsData = [], loading, visibleFields, onlyUpdateConfirm = false }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [updateConfirmData, setUpdateConfirmData] = useState([]);
    const [remoteVersion, setRemoteVersion] = useState(null);
    const logContainerRef = useRef(null);

    useEffect(() => {
        const filtered = windowsLogsData.filter((log) => {
            const logMessage = `${log.id} ${new Date(log.created_at).toLocaleString()} ${log.outlet_id} ${log.exception} ${log.source} ${log.additional_info} ${log.log_level} ${log.log_code} ${log.outlet_name} ${log.message}`;
            return logMessage.toLowerCase().includes(searchTerm.toLowerCase());
        });

        const makeKey = (l) => `${l.outlet_id}||${l.message}||${l.exception}||${l.source}||${l.additional_info}`;
        const groupsMap = new Map();
        for (const log of filtered) {
            const key = makeKey(log);
            if (!groupsMap.has(key)) groupsMap.set(key, []);
            groupsMap.get(key).push(log);
        }

        const groups = [];
        for (const [key, items] of groupsMap.entries()) {
            const sorted = [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            const representative = sorted[0];
            groups.push({
                _groupKey: key,
                mergedCount: items.length,
                representativeTimestamp: representative.created_at,
                representative,
                mergedItems: sorted,
            });
        }

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
        const sortedData = [...updateConfirmData].sort((a, b) => Number(a.outlet_id) - Number(b.outlet_id));

        if (!remoteVersion) {
            return (
                <div className="viewer-panel" style={{ flex: 1, minHeight: 0, height: '100%' }}>
                    <div
                        className="alert text-info text-center rounded shadow-sm"
                        style={{
                            fontSize: 13,
                            padding: 14,
                            marginBottom: 0,
                            background: 'rgba(56, 189, 248, 0.08)',
                            borderColor: 'rgba(56, 189, 248, 0.22)',
                        }}
                    >
                        Mengambil versi terbaru dari server...
                    </div>
                </div>
            );
        }

        return (
            <div className="viewer-panel" style={{ flex: 1, minHeight: 0, height: '100%' }}>
                <div className="section-heading" style={{ marginBottom: 16 }}>
                    <div>
                        <div className="section-heading__eyebrow">
                            <i className="bi bi-cloud-arrow-down-fill"></i>
                            Update Confirmation
                        </div>
                        <p className="section-heading__description" style={{ marginTop: 10 }}>
                            Compare installed versions across outlets against the latest remote release.
                        </p>
                    </div>
                    <div className="chip-button is-active" style={{ cursor: 'default' }}>
                        <i className="bi bi-diagram-3"></i>
                        {sortedData.length} outlets
                    </div>
                </div>

                {sortedData.length > 0 ? (
                    <div
                        className="viewer-scroll"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                            gap: 14,
                            alignItems: 'stretch',
                            width: '100%',
                            maxHeight: '100%',
                            overflow: 'auto',
                            paddingRight: 4,
                        }}
                    >
                        {sortedData.map((update) => (
                            <UpdateConfirmCard key={update.outlet_id} update={update} remoteVersion={remoteVersion} />
                        ))}
                    </div>
                ) : (
                    <div
                        className="alert text-info text-center rounded shadow-sm"
                        style={{
                            fontSize: 13,
                            padding: 14,
                            marginBottom: 0,
                            background: 'rgba(56, 189, 248, 0.08)',
                            borderColor: 'rgba(56, 189, 248, 0.22)',
                        }}
                    >
                        Tidak ada data update yang tersedia
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="modern-log-windows-viewer" style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 16 }}>
            <div className="toolbar-card" style={{ marginBottom: 0 }}>
                <div>
                    <div className="section-heading__eyebrow">
                        <i className="bi bi-pc-display"></i>
                        Windows Client Logs
                    </div>
                    <div style={{ marginTop: 10 }}>
                        <h6 style={{ margin: 0, color: '#f8fafc', fontSize: 18, fontWeight: 700 }}>Grouped outlet diagnostics</h6>
                        <p style={{ margin: '6px 0 0', color: '#94a3b8' }}>
                            Similar logs are merged automatically so recent incidents are easier to review.
                        </p>
                    </div>
                </div>
                <div className="chip-row">
                    <div className="chip-button is-active" style={{ cursor: 'default' }}>
                        <i className="bi bi-stack"></i>
                        <span>Groups</span>
                        <span className="chip-button__meta">{filteredLogs.length}</span>
                    </div>
                    <div className="chip-button" style={{ cursor: 'default' }}>
                        <i className="bi bi-list-ol"></i>
                        <span>Logs</span>
                        <span className="chip-button__meta">{windowsLogsData.length}</span>
                    </div>
                </div>
            </div>

            <div className="search-shell">
                <span className="search-shell__icon">
                    <i className="bi bi-search"></i>
                </span>
                <input
                    type="text"
                    placeholder="Search outlet, source, exception, or message"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control border-0"
                    style={{ flex: 1, background: 'transparent', paddingLeft: 0 }}
                />
            </div>

            <div
                ref={logContainerRef}
                className="viewer-panel viewer-scroll"
                style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
            >
                {loading && (
                    <div className="text-center" style={{ padding: '18px 0' }}>
                        <div className="spinner-border text-info" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                )}
                <div className="log-entries" style={{ marginTop: 0, display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 'none' }}>
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
                        <div
                            className="alert text-info text-center rounded shadow-sm"
                            style={{
                                fontSize: 13,
                                padding: 14,
                                marginBottom: 0,
                                background: 'rgba(56, 189, 248, 0.08)',
                                borderColor: 'rgba(56, 189, 248, 0.22)',
                            }}
                        >
                            Tidak ada log untuk ditampilkan
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LogWindowsViewer;
