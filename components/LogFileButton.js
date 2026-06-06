import React from 'react';

const LogFileButton = ({ fileName, onClick }) => {
    return (
        <button
            onClick={onClick}
            className="chip-button"
            style={{
                maxWidth: '280px',
                cursor: 'pointer',
                justifyContent: 'space-between',
                width: '100%',
                minHeight: 44,
            }}
        >
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {fileName}
            </span>
            <i className="bi bi-arrow-up-right-circle" style={{ flexShrink: 0 }}></i>
        </button>
    );
};

export default LogFileButton;
