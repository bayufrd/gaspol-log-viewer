import React from 'react';

const LogWindowsEntry = ({ key ,timestamp, outlet_id, level, message, logCode, outletName, exception, source, additionalInfo }) => {
    const levelColors = {
        error: {
            bg: 'bg-black',  // Kelas latar belakang gelap bootstrap
            text: 'text-danger'  // Kelas teks merah dari bootstrap
        },
        warn: {
            bg: 'bg-warning',  // Kelas latar belakang gelap bootstrap
            text: 'text-dark'  // Kelas teks kuning dari bootstrap
        },
        info: {
            bg: 'bg-dark',   // Kelas latar belakang hitam bootstrap
            text: 'text-success'   // Kelas teks hijau bootstrap
        }
    };

    const { bg, text } = levelColors[level] || levelColors['info'];

    return (
        <div className={`log-entry p-2 mb-2 rounded ${bg}`}>
            <div className="d-flex justify-content-between align-items-center mb-1"style={{ fontFamily: 'Courier New, Courier, monospace' }}>
                <small className="text-white300">{timestamp}</small>
                <span className={`badge ${text} text-uppercase`}>{level.toUpperCase()}</span>
            </div>
            <div className="log-message" style={{ fontFamily: 'Courier New, Courier, monospace' }}>
                {`${level.toUpperCase()}[${logCode}] Outlet ID : ${outlet_id}  (${outletName}) || msg: ${message} || ex: ${exception} || sc: ${source} || adtinfo: ${additionalInfo}`}</div>
        </div>
    );
};

export default LogWindowsEntry;