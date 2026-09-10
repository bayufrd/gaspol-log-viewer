import React, { useState, useEffect, useRef, useCallback } from 'react';
import LogEntry from './LogWindowsEntry';

const LogWindowsViewer = ({ windowsLogsData = [], loading, visibleFields, onlyUpdateConfirm = false, error = '' }) => {
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

    const fetchUpdateConfirmData = useCallback(async () => {
        try {
            const baseUri = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${baseUri}/update-confirm`);
            if (!response.ok) throw new Error('Data tidak ditemukan');
            const data = await response.json();
            setUpdateConfirmData(data.data || []);
        } catch (error) {
            console.error('Error fetching update confirm data:', error);
            setUpdateConfirmData([]);
        }
    }, []);

    useEffect(() => {
        fetchUpdateConfirmData();
    }, [fetchUpdateConfirmData]);

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

    const clearSearch = () => setSearchTerm('');

    return (
        <section className="windows-log-viewer" aria-labelledby="windows-log-list-title">
            <div className="windows-log-viewer__header">
                <div>
                    <span className="windows-log-viewer__eyebrow"><i className="bi bi-list-nested"></i> Event stream</span>
                    <h2 id="windows-log-list-title">Windows Client Logs</h2>
                </div>
                <div className="windows-summary-cards" aria-label="Log summary">
                    <div className="windows-summary-card"><span>Groups</span><strong>{filteredLogs.length}</strong></div>
                    <div className="windows-summary-card"><span>Logs</span><strong>{windowsLogsData.length}</strong></div>
                </div>
            </div>
            <div className="windows-log-search">
                <i className="bi bi-search" aria-hidden="true"></i>
                <label className="visually-hidden" htmlFor="windows-log-search-input">Search logs</label>
                <input id="windows-log-search-input" type="search" placeholder="Search outlet, source, exception, or message" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                {searchTerm && <button type="button" onClick={clearSearch} aria-label="Clear search"><i className="bi bi-x-lg"></i></button>}
            </div>
            <div ref={logContainerRef} className="windows-log-list" aria-live="polite">
                {error ? (
                    <div className="windows-state windows-state--error"><i className="bi bi-exclamation-triangle"></i><strong>Unable to load logs</strong><span>{error}</span></div>
                ) : loading ? (
                    <div className="windows-state"><span className="spinner-border spinner-border-sm" role="status"></span><strong>Loading Windows client logs</strong><span>Fetching the latest outlet events…</span></div>
                ) : filteredLogs.length > 0 ? (
                    filteredLogs.map((group, idx) => {
                        const rep = group.representative || {};
                        return <LogEntry key={`${group._groupKey || idx}`} timestamp={new Date(group.representativeTimestamp || rep.created_at).toLocaleString()} outlet_id={rep.outlet_id} outletName={rep.outlet_name} level={rep.log_level} message={rep.message} logCode={rep.log_code} exception={rep.exception} source={rep.source} additionalInfo={rep.additional_info} visibleFields={visibleFields} mergedCount={group.mergedCount || 1} mergedItems={group.mergedItems || [rep]} />;
                    })
                ) : (
                    <div className="windows-state windows-state--empty"><i className="bi bi-search"></i><strong>No logs found</strong><span>{searchTerm ? 'Try a different search term or clear the filter.' : 'No Windows client logs are available for this stream.'}</span>{searchTerm && <button type="button" className="windows-secondary-button" onClick={clearSearch}>Clear search</button>}</div>
                )}
            </div>
        </section>
    );
};

export default LogWindowsViewer;
